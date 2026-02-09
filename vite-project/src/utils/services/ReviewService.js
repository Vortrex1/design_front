import axios from 'axios';
import REMOTE_HOST_NAME from '../../env/index';

const API_URL = REMOTE_HOST_NAME + 'api/reviews';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  console.log('Auth token:', token ? 'Token exists' : 'No token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const ReviewService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}`, getAuthHeaders());
    return response.data;
  },
  getByProductId: async (productId) => {
    console.log('ReviewService getting reviews for product:', productId);
    const response = await axios.get(`${API_URL}/product/${productId}`, getAuthHeaders());
    console.log('ReviewService getByProductId response:', response.data);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },
  create: async (review) => {
    console.log('ReviewService creating review:', review);
    const response = await axios.post(`${API_URL}`, review, getAuthHeaders());
    console.log('ReviewService response:', response.data);
    return response.data;
  },
  update: async (review) => {
    const response = await axios.put(`${API_URL}`, review, getAuthHeaders());
    return response.data;
  },
  delete: async (id) => {
    console.log('ReviewService deleting review:', id);
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    console.log('ReviewService delete response:', response.data);
    return response.data;
  },
};
