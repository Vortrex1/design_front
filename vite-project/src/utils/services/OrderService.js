import axios from 'axios';
import REMOTE_HOST_NAME from "../../env/index";

const API_URL = `${REMOTE_HOST_NAME}api/order`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

class OrderService {
  static async createOrder(orderData) {
    try {
      // Validate required fields
      if (!orderData.userId) {
        throw new Error('User ID is required');
      }
      if (!orderData.cartItemIds || orderData.cartItemIds.length === 0) {
        throw new Error('Cart items are required');
      }
      if (!orderData.customerEmail) {
        throw new Error('Customer email is required');
      }

      console.log('Sending order request to:', `${API_URL}/create`);
      console.log('Order data:', orderData);

      const response = await axios.post(`${API_URL}/create`, orderData, getAuthHeaders());
      
      console.log('Order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('OrderService.createOrder error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const response = await axios.get(`${API_URL}/get-by-id/${orderId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async checkPaymentStatus(orderId) {
    try {
      console.log('Checking payment status for order:', orderId);
      const response = await axios.post(`${API_URL}/check-payment-status/${orderId}`, {}, getAuthHeaders());
      console.log('Payment status check result:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw error;
    }
  }
}

export default OrderService;
