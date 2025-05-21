import axios from "axios";

export const API_BASE_URL = "https://chatalize.247go.app/";
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );

export default api;
