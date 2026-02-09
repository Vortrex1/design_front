// src/utils/services/ProductService.js
import axios from 'axios';
import  REMOTE_HOST_NAME  from "../../env/index";

const API_URL = REMOTE_HOST_NAME + 'products';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const ProductService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/get-by-id/${id}`, getAuthHeaders());
    return response.data;
  },
  getAllFiltered: async (filters) => {
    const params = new URLSearchParams();
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.currency) params.append('currency', filters.currency);
    if (filters.status) params.append('status', filters.status);
    if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);

    const response = await axios.get(`${API_URL}/get-all-filtered?${params.toString()}`, getAuthHeaders());
    return response.data;
  },
  addProduct: async (product) => {
    const response = await axios.post(`${API_URL}/add`, product, getAuthHeaders());
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    return response.data;
  },
  updateProduct: async (product) => {
    const response = await axios.put(`${API_URL}/update`, product, getAuthHeaders());
    return response.data;
  },
  uploadProductImages: async (productId, formData) => {
    const response = await axios.put(
      `${API_URL}/upload-images/${productId}`,
      formData,
      {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },
  deleteProductImage: async (productId, photoName) => {
    const response = await axios.put(
      `${API_URL}/delete-image/${productId}?photoName=${photoName}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },
getByCategoryId: async (categoryId, { minPrice, maxPrice, currency, status, searchQuery, sort , page = 1 }) => {
    const params = new URLSearchParams({
      categoryId,
      page,
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(currency && { currency }),
      ...(status && { status }),
      ...(searchQuery && { searchQuery }),
      ...(sort && { sort }),
    });
    console.log("params", params);


    const response = await axios.get(`${API_URL}/get-by-category-id/${categoryId}?${params.toString()}`, getAuthHeaders());
    return {
      categoryId,
      items: response.data.items || [],
      totalPages: response.data.totalPages || 0,
    };
  },
};