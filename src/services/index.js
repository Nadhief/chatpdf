import api from "./api";

export const chatPersonal = async (payload) => {
  try {
    const response = await api.post("chat/personal_v2/", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const chatDepartemen = async (payload) => {
  try {
    const response = await api.post("chat/department_v2/", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const chatTopic = async (payload) => {
  try {
    const response = await api.post("chat/topic_v2/", payload);
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

export const getTopic = async ({ user_id, keywords, page, per_page }) => {
  try {
    const response = await api.get("topic/personal", {
      params: {
        user_id,
        keywords,
        page,
        per_page
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

export const getDepartmentName = async (id) => {
  try {
    const data = await getDepartmentList();
    const departments = data.response;

    const found = departments.find((dept) => dept[0] === id);
    return found ? found[1] : null;
  } catch (error) {
    console.error("Error getting department name by ID:", error);
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
    const response = await api.post("file/summarize_personal_v2", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting department:", error);
    throw error;
  }
};

export const summarizeFileDepartment = async (payload) => {
  try {
    const response = await api.post("file/summarize_department_v2", payload);
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

export const searchFilePersonal = async ({user_id, keywords, page, per_page}) => {
  try {
    const response = await api.get("file/search_personal", {
      params: {
        user_id: user_id,
        keywords: keywords,
        Page: page,
        per_page: per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const searchFileDepartment = async ({dept_id, keywords, page, per_page}) => {
  try {
    const response = await api.get("file/search_department", {
      params: {
        dept_id: dept_id,
        keywords: keywords,
        Page: page,
        per_page: per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const searchUser = async ({ keywords}) => {
  try {
    const response = await api.get("users/search_user", {
      params: {
        keywords: keywords,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};
export const searchDepartment = async ({ keywords}) => {
  try {
    const response = await api.get("department/search_department", {
      params: {
        keywords: keywords,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const searchTopic = async ({ keywords, user_id}) => {
  try {
    const response = await api.get("topic/search_personal_topic", {
      params: {
        user_id: user_id,
        keywords: keywords,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}


export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file_upload", file);

    const response = await api.post("logo/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading logo:", error);
    throw error;
  }
};

export const getArrayBufferPDFPersonal = async({user_id, filename, page}) =>{
  
  try {
    const response = await api.get("file/buffer_doc_personal", {
      params: {
        user_id: user_id,
        filename: filename,
        page: page,
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error("Error getting pdf:", error);
    throw error;
  }
} 

export const getArrayBufferPDFGlobal = async({user_id, filename, page}) =>{
  try {
    const response = await api.get("file/buffer_doc_global", {
      params: {
        user_id: user_id,
        filename: filename,
        page: page,
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error("Error getting pdf:", error);
    throw error;
  }
} 

export const getArrayBufferPDFDepartment = async({dept_id, filename, page}) =>{
  try {
    const response = await api.get("file/buffer_doc_department", {
      params: {
        dept_id: dept_id,
        filename: filename,
        page: page,
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error("Error getting pdf:", error);
    throw error;
  }
} 

export const personalToGlobal = async ({ filename, user_id }) => {
  try {
    const response = await api.post("/file/personal_to_global", {
      filename: filename,
      user_id: user_id
    });
    return response.data;
  } catch (error) {
    console.error("Error converting personal file to global:", error);
    throw error;
  }
};

export const getGlobalFile = async ({ page, per_page, keyword }) => {
  try {
    const response = await api.get("file/global", {
      params: {
        page,
        per_page,
        keyword
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
};

export const deleteGlobalFile = async ({ filename }) => {
  try {
    const response = await api.delete("file/remove_pdf_global_doc", {
      data: { filename }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting global file:", error);
    throw error;
  }
}

export const getHistory = async ({ user_id }) => {
  try {
    const response = await api.get("/chat/history_user/chatdocs", {
      params: {
        user_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting history:", error);
    throw error;
  }
}

export const getChatByHistoryId = async (payload) => {  
  try {
    const response = await api.post("/chat/load_chat/chatdocs", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting chat by history ID:", error);
    throw error;
  }
}

export const deleteHisotryById = async (historyId) => {
  try {
    const response = await api.delete("/chat/history/remove/chatdocs", {
      params: { history_id: historyId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting history by ID:", error);
    throw error;
  }
};

export const uploadJsonPersonal = async (formData) => {
  try {
    const response = await api.post("/file/upload_json_personal", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading JSON personal:", error);
    throw error;
  }
};

export const uploadJsonDept = async (formData) => {
  try {
    const response = await api.post("/file/upload_json_dept", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading JSON department:", error);
    throw error;
  }
};

export const uploadImagePersonal = async (formData) => {
  try {
    const response = await api.post("/file/upload_image_personal", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image personal:", error);
    throw error;
  }
};

export const uploadImageDept = async (formData) => {
  try {
    const response = await api.post("/file/upload_image_dept", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image department:", error);
    throw error;
  }
};

export const uploadDocxPersonal = async (formData) => {
  try {
    const response = await api.post("/file/upload_docx_personal", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading DOCX personal:", error);
    throw error;
  }
};


export const uploadDocxDept = async (formData) => {
  try {
        const response = await api.post("/file/upload_docx_dept", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading DOCX department:", error);
    throw error;
  }
};

export const deleteImagePersonal = async ({ id, filename }) => {
  try {
    const response = await api.delete("/file/remove_image_personal", {
      data: { id, filename },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting personal image:", error);
    throw error;
  }
};

export const deleteImageDept = async ({ id, filename }) => {
  try {
    const response = await api.delete("/file/remove_image_dept", {
      data: { id, filename },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting department image:", error);
    throw error;
  }
};

export const deleteJsonPersonal = async ({ id, filename }) => {
  try {
    const response = await api.delete("/file/remove_json_personal", {
      data: { id, filename },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting personal JSON:", error);
    throw error;
  }
};

export const deleteJsonDept = async ({ id, filename }) => {
  try {
    const response = await api.delete("/file/remove_json_dept", {
      data: { id, filename },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting department JSON:", error);
    throw error;
  }
};