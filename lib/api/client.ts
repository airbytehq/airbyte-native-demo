import axios, { AxiosError, AxiosInstance, CreateAxiosDefaults } from "axios";

export const HOST_URL = "https://api.airbyte.com";

export interface Error {
  message: string;
}

export interface CurrentUser {
  apiKey: string;
}

export interface ApiInput {
  currentUser: CurrentUser;
}

export interface ApiResult {
  error?: Error;
}

export function getClient(user?: CurrentUser): AxiosInstance {
  const info: CreateAxiosDefaults = {
    baseURL: HOST_URL,
    timeout: 10000,
    headers: {},
  };

  if (user?.apiKey) {
    info.headers["Authorization"] = "Bearer " + user.apiKey;
  }

  const instance = axios.create(info);

  // Add a request interceptor
  instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      return config;
    },
    function (err) {
      // Do something with request error
      console.error(err);
      return Promise.reject(err);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (err) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      console.error(err);
      return Promise.reject(err);
    }
  );

  return instance;
}

export function processError(err: any, defaultMessage: string) {
  if (axios.isAxiosError(err)) {
    const axiosErr = <AxiosError>err;
    if (axiosErr?.response?.status === 401) {
      return { error: { message: "Unknown API Key" } };
    }
  }
  const error = { message: err?.message || defaultMessage };
  return { error };
}
