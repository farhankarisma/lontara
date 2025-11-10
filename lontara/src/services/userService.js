import apiClient from "./apiClient";

class UserService {
  /**
   * Admin: Create new user
   * Calls: POST /api/admin/create-user
   * @param {Object} userData - {username, email, role}
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createUser(userData) {
    return apiClient.post("/admin/create-user", userData);
  }

  /**
   * User: Verify activation token
   * @param {string} token - Activation token
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async verifyToken(token) {
    return apiClient.get(`/user/verify-token/${token}`);
  }

  /**
   * User: Activate account with password
   * @param {string} token - Activation token
   * @param {string} password - New password
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async activateAccount(token, password) {
    return apiClient.post("/user/activate", { token, password });
  }

  /**
   * User: Get Gmail OAuth connect URL
   * @returns {Promise<{success: boolean, data?: {url: string}, error?: string}>}
   */
  async getGmailConnectUrl() {
    return apiClient.get("/user/gmail-connect-url");
  }

  /**
   * User: Disconnect Gmail account
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async disconnectGmail() {
    return apiClient.post("/user/gmail-disconnect");
  }

  /**
   * Admin: Get all users (if implemented)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getAllUsers() {
    return apiClient.get("/admin/users");
  }

  /**
   * Admin: Delete user (if implemented)
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteUser(userId) {
    return apiClient.delete(`/admin/users/${userId}`);
  }

  /**
   * Auth: Get current user profile
   * Calls: GET /api/auth/me
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getCurrentUser() {
    return apiClient.get("/auth/me");
  }
}

export default new UserService();
