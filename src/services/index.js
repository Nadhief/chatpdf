import api from "./api";

export const chatPersonal = async (payload) => {
    try {
      const response = await api.post("chat/personal/", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  };

  export const createDepartment = async (payload) => {
    try {
      const response = await api.post("department/create_department", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }
