import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor - Auto inject token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized - Auto logout
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.error("Access forbidden:", error.response.data);
        }

        // Handle 404 Not Found
        if (error.response?.status === 404) {
          console.error("Resource not found:", error.config.url);
        }

        // Handle 500 Server Error
        if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   * @param {string} url - Endpoint URL
   * @param {object} config - Axios config
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body
   * @param {object} config - Axios config
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async post(url, data, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body
   * @param {object} config - Axios config
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async put(url, data, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body
   * @param {object} config - Axios config
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async patch(url, data, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   * @param {string} url - Endpoint URL
   * @param {object} config - Axios config
   * @returns {Promise<{success: boolean, data?: any, error?: string, status?: number}>}
   */
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle error responses
   * @param {Error} error - Axios error object
   * @returns {{success: boolean, error: string, status?: number}}
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.message || error.response.statusText || "An error occurred",
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        success: false,
        error: "No response from server. Please check your connection.",
        status: 0,
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }

  /**
   * Upload file with progress tracking
   * @param {string} url - Endpoint URL
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async uploadFile(url, formData, onProgress) {
    try {
      const response = await this.client.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new ApiClient();