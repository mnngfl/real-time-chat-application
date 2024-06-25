import axios, { type AxiosError, type AxiosResponse } from "axios";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}/api`;

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isCalled = false;

instance.interceptors.request.use(
  (config) => {
    const existToken = JSON.parse(localStorage.getItem("user")!);

    if (!config.url?.startsWith("/auth")) {
      config.headers["Authorization"] = existToken.accessToken;
    }

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const existToken = JSON.parse(localStorage.getItem("user") || "{}");

    if (error.response) {
      console.log("API Error: ", error.response.status, error.message);

      if (error.response.status === 401 && existToken.accessToken) {
        if (isCalled) return;
        isCalled = true;

        try {
          const res = await axios.post(baseUrl + "/auth/refresh-token", {
            refreshToken: existToken.refreshToken,
          });
          isCalled = false;
          const newToken = res?.data?.accessToken;

          if (newToken) {
            instance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            existToken.accessToken = newToken;
            localStorage.setItem("user", JSON.stringify(existToken));
          }

          if (error.config) {
            error.config.headers["Authorization"] = `Bearer ${newToken}`;
            return instance(error.config);
          }
        } catch (error) {
          console.error("Failed to refresh access token: ", error);
          localStorage.removeItem("user");
          throw error;
        }
      }

      if (error.response.data.message) {
        return Promise.reject(error.response.data.message);
      }
    } else if (error.request) {
      console.log("No response received: ", error.request);
    } else {
      console.log("Error setting up request: ", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
