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

export const chatDepartemen = async (payload) => {
  try {
    const response = await api.post("chat/department/", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const chatTopic = async (payload) => {
  try {
    const response = await api.post("chat/topic/", payload);
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
};

export const getTopic = async ({ user_id }) => {
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
};

export const deleteTopic = async (payload) => {
  try {
    const response = await api.post("topic/remove_personal_topic", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const getDepartmentList = async () => {
  try {
    const response = await api.get("department/department_list");
    return response.data;
  } catch (error) {
    console.error("Error getting department:", error);
    throw error;
  }
};

export const getDepartmentFile = async ({ dept_id, page, per_page }) => {
  try {
    const response = await api.get("file/department", {
      params: {
        dept_id,
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting department:", error);
    throw error;
  }
};

export const summarizeFilePersonal = async (payload) => {
  try {
    const response = await api.post("file/summarize_personal", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting department:", error);
    throw error;
  }
};

export const summarizeFileDepartment = async (payload) => {
  try {
    const response = await api.post("file/summarize_department", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting department:", error);
    throw error;
  }
};

export const deletePersonalFile = async ({ id, filename }) => {
  try {
    const response = await api.post("file/remove_pdf_personal_doc", {
      id,
      filename,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const deleteDepartmentlFile = async ({ id, filename }) => {
  try {
    const response = await api.post("file/remove_pdf_dept_doc", {
      id,
      filename,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const uploadPersonalFile = async (payload) => {
  try {
    const response = await api.post("file/upload_pdf_personal", payload);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadDepartmentFile = async (payload) => {
  try {
    const response = await api.post("file/upload_pdf_department", payload);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadPersonalToDepartmentFile = async (payload) => {
  try {
    const response = await api.post("file/add_multifile_department", payload);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const removeDepartment = async (payload) => {
  try {
    const response = await api.post("department/remove_department", payload);
    return response.data;
  } catch (error) {
    console.error("Error removing department:", error);
    throw error;
  }
};

export const editDepartment = async (payload) => {
  try {
    const response = await api.post("department/edit_department", payload);
    return response.data;
  } catch (error) {
    console.error("Error editting department:", error);
    throw error;
  }
};

export const createUser = async (payload) => {
  try {
    const response = await api.post("users/create_user", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getUserList = async () => {
  try {
    const response = await api.get("users/user_list");
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const removeUser = async (payload) => {
  try {
    const response = await api.post("users/remove_user", payload);
    return response.data;
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

export const editUser = async (payload) => {
  try {
    const response = await api.post("users/update_user", payload);
    return response.data;
  } catch (error) {
    console.error("Error editting user:", error);
    throw error;
  }
};