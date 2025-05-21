import axios from "axios";

export const API_BASE_URL = "192.168.1.65:8001/";
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
