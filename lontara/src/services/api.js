// API service untuk komunikasi dengan backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method untuk HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async adminLogin(credentials) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyEmail(token) {
    return this.request(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    });
  }

  // Admin methods
  async createUser(userData, adminToken) {
    return this.request('/admin/create-user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async getUsers(adminToken) {
    return this.request('/admin/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
  }

  async resendVerification(userId, adminToken) {
    return this.request('/admin/resend-verification', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ userId }),
    });
  }

  // Test connection
  async healthCheck() {
    return this.request('/health', { method: 'GET' });
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;