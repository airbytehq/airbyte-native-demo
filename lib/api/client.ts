import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { CurrentUser } from "./login";

export const HOST_URL = "https://api.airbyte.com";

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
