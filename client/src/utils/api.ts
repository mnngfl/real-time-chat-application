import axios from "axios";
import { refreshToken } from "../services/users";

const baseUrl = "http://localhost:3000/api";

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

const token = JSON.parse(localStorage.getItem("user")!).accessToken;

instance.interceptors.request.use(
  (config) => {
    if (!config.url?.startsWith("/auth")) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  async (error) => {
    console.error(error);
    if (error.response.status === 401) {
      const newToken = await refreshToken({ refreshToken: token });
      instance.defaults.headers.common["Authorization"] = newToken.accessToken;
    } else {
      return Promise.reject(error.response.data.message);
    }
  }
);

export default instance;
