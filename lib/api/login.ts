import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { getClient } from "./client";

const SECURE_API_KEY = "apiKey";

export interface CurrentUser {
  apiKey: string;
}

export interface LoginForm {
  apiKey: string;
}

export interface Error {
  message: string;
}

export interface LoginFormResult {
  user?: CurrentUser | null;
  error?: Error | null;
}

export async function checkAndStoreLogin(
  form: LoginForm
): Promise<LoginFormResult> {
  const client = getClient({ apiKey: form.apiKey });

  try {
    const response = await client.get("/v1/workspaces");
    if (response.status >= 200 && response.status < 300) {
      const user = { apiKey: form.apiKey };
      await SecureStore.setItemAsync(SECURE_API_KEY, user.apiKey);
      return { user };
    } else {
      // unknown error
      const error = { message: "Unknown error logging in" };
      return { error };
    }
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const axiosErr = <AxiosError>err;
      if (axiosErr?.response?.status === 401) {
        return { error: { message: "Unknown API Key" } };
      }
    }

    const error = { message: err?.message || "Error logging in" };
    return { error };
  }
}

export async function clearLogin() {
  try {
    await SecureStore.deleteItemAsync(SECURE_API_KEY);
  } catch (err) {
    console.error(err);
  }
}

export async function autoloadOnStartup(): Promise<CurrentUser> {
  try {
    const apiKey = await SecureStore.getItemAsync(SECURE_API_KEY);
    if (apiKey) {
      // see if it's correct
      const { user } = await checkAndStoreLogin({ apiKey });
      if (!user) {
        await clearLogin();
      }
      return user;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}
