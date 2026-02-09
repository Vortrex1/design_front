import HttpClient from '../http/HttpClient';
import  REMOTE_HOST_NAME  from "../../env/index";

  const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export class FavoriteService {
  static httpClient = new HttpClient({
    baseURL: REMOTE_HOST_NAME + "favorite-products",
  });


  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }
  static async getFavoriteProducts(userId) {
    const response = await this.httpClient.get(`user/${userId}`, getAuthHeaders());
    return response;

  }

  static async addFavoriteProduct(userId, productId) {
    const model = { userId, productId };
    console.log("model", model);
    
    return await this.httpClient.post(`add`, model, getAuthHeaders());
  }

  static async removeFavoriteProduct(productId) {
    console.log("removeFavoriteProduct productId", productId);
    
    return await this.httpClient.delete(`delete/${productId}`, getAuthHeaders());
  }

}
