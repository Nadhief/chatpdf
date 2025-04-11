import api from "./api";

export const login = async (payload) => {
  try {
    const response = await api.post("auth/login", payload);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}