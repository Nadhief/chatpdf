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
  };

  export const getPersonalFile = async ({ user_id, page, per_page }) => {
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
      const response = await api.post("file/add_topic_personal", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }

  export const getTopic = async ({user_id}) => {
    try {
      const response = await api.get("topic/personal", {
        params: {
          user_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }

  export const deleteTopic = async (payload) => {
    try {
      const response = await api.post("topic/remove_personal_topic", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      throw error;
    }
  }

  export const deletePersonalFile = async ({ id, filename }) => {
    try {
      const response = await api.post("file/remove_pdf_personal_doc", { id, filename });
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  export const uploadPersonalFile = async (payload) => {
    try {
      const response = await api.post("file/upload_pdf_personal", payload);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }