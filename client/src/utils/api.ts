import axios from "axios";

const baseUrl = "http://localhost:3000/api";

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  function (error) {
    console.error(error);
    return Promise.reject(error.response.data.message);
  }
);

export default instance;
