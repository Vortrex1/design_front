// src/utils/services/CategoryService.js
import axios from 'axios';
import REMOTE_HOST_NAME from "../../env/index";

const API_URL = REMOTE_HOST_NAME + 'categories';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const CategoryService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/get-by-id/${id}`, getAuthHeaders());
    return response.data;
  },

  addCategory: async (category) => {
    const response = await axios.post(`${API_URL}/add`, category, getAuthHeaders());
    return response.data;
  },
  updateCategory: async (Data) => {
    await axios.put(`${API_URL}/update`, Data, getAuthHeaders());
  },
  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    return response.data;
  },
  uploadImage : async (categoryId, file) => {  
    const response = await axios.put(`${API_URL}/upload-images/${categoryId}`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};
