import axios from 'axios';
import REMOTE_HOST_NAME from '../../env';

const API_URL = REMOTE_HOST_NAME + 'cart-items';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const CartItemService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
  },

  getById: async (cartItemId) => {
    const response = await axios.get(`${API_URL}/get-by-id/${cartItemId}`, getAuthHeaders());
    return response.data;
  },

  getByUserId: async (userId) => {
    const response = await axios.get(`${API_URL}/get-by-user-id/${userId}`, getAuthHeaders());
    return response.data;
  },

  create: async (cartItemData) => {
    debugger
    console.log(`${API_URL}/create`, cartItemData);
    const response = await axios.post(`${API_URL}/create`, cartItemData, getAuthHeaders());
    
    debugger
    return response.data;
  },

  updateQuantity: async (cartItemId, quantity) => {
    const response = await axios.put(
      `${API_URL}/update-quantity/${cartItemId}`,
      { quantity },
      getAuthHeaders()
    );
    return response.data;
  },

  delete: async (cartItemId) => {
    const response = await axios.delete(`${API_URL}/delete/${cartItemId}`, getAuthHeaders());
    return response.data;
  }
};