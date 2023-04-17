import axios, { AxiosError } from "axios";
import { getClient } from "./client";

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

export async function checkLogin(form: LoginForm): Promise<LoginFormResult> {
  const client = getClient({ apiKey: form.apiKey });

  try {
    const response = await client.get("/v1/workspaces");
    if (response.status >= 200 && response.status < 300) {
      const user = { apiKey: form.apiKey };
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
