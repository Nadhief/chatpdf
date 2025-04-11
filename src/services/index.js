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

  export const getPersonalFile = async ({ user_id, page, per_page }) => {
    console.log("user_id", user_id)
    try {
      const response = await api.get("file/personal", {
        params: {
          user_id,
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting file:", error);
      throw error;
    }
  };  
  export const createTopic = async (payload) => {
    try {
      const response = await api.post("topic/create_topic", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }

  export const getTopic = async () => {
    try {
      const response = await api.get("topic/get_topic");
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }

  export const deleteTopic = async (payload) => {
    try {
      const response = await api.post("topic/delete_topic", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }
