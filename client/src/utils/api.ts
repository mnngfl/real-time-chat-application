import axios from "axios";

const baseUrl = "http://localhost:3000/api";

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

const user = JSON.parse(localStorage.getItem("user")!);
let isCalled = false;

instance.interceptors.request.use(
  (config) => {
    if (!config.url?.startsWith("/auth")) {
      config.headers["Authorization"] = user.accessToken;
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
    if (error.response.status === 401 && user.accessToken) {
      if (isCalled) return;
      isCalled = true;

      try {
        const res = await axios.post(baseUrl + "/auth/refresh-token", {
          refreshToken: user.refreshToken,
        });
        isCalled = false;
        const newToken = res?.data?.accessToken;

        if (newToken) {
          instance.defaults.headers.common["Authorization"] = newToken;
          user.accessToken = newToken;
          localStorage.setItem("user", JSON.stringify(user));
        }

        const originRequest = error.config;
        originRequest.headers["Authorization"] = newToken;
        return instance(originRequest);
      } catch (error) {
        console.error("Failed to refresh access token: ", error);
        throw error;
      }
    }
    return Promise.reject(error.response.data.message);
  }
);

export default instance;
