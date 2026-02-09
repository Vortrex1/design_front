import HttpClient from '../http/HttpClient';
import  REMOTE_HOST_NAME  from "../../env/index";

export class UserService {
  static httpClient = new HttpClient({
    baseURL: REMOTE_HOST_NAME + "users",
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getUsers() {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    return await this.httpClient.get("get-all");
  }

  static async getUserById(userId) {
    return await this.httpClient.get(`get-by-id/${userId}`);
  }

  static async delete(userId) {
    return await this.httpClient.delete(`delete/${userId}`);
  }

  static async changeRoles(userId, role) {
    return await this.httpClient.put(`update-roles/${userId}`, role);
  }

  static async uploadImage(userId, file) {

    debugger
    return await this.httpClient.put(`upload-image/${userId}`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async deleteImage(userId, photoName) {
    return await this.httpClient.put(`delete-image/${userId}`, photoName);
  }

  static async updateUser(userId, model) {
    return await this.httpClient.put(`update/${userId}`, model);
  }


  static async createUser(model) {
    console.log(model);
    
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    try {
      return await this.httpClient.post("create", model);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return { success: false, message: "User already exists." };
      }
      throw error;
    }
  }
}
