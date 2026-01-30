const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Assignment endpoints
  async getAssignments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/assignments${queryString ? `?${queryString}` : ''}`);
  }

  async getMyAssignments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/assignments/my${queryString ? `?${queryString}` : ''}`);
  }

  async getAssignment(id) {
    return this.request(`/assignments/${id}`);
  }

  async createAssignment(assignmentData) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async assignWriter(assignmentId, writerId, writerName) {
    return this.request(`/assignments/${assignmentId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ writerId, writerName }),
    });
  }

  async updateAssignmentStatus(assignmentId, status, notes) {
    return this.request(`/assignments/${assignmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async deleteAssignment(assignmentId) {
    return this.request(`/assignments/${assignmentId}`, {
      method: 'DELETE',
    });
  }

  async bulkAssignAssignments(assignmentIds, writerId, writerName) {
    return this.request('/assignments/bulk-assign', {
      method: 'POST',
      body: JSON.stringify({ assignmentIds, writerId, writerName }),
    });
  }

  async bulkDeleteAssignments(assignmentIds) {
    return this.request('/assignments/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ assignmentIds }),
    });
  }

  // Writer endpoints
  async getWriters() {
    return this.request('/writers');
  }

  async getPendingWriters() {
    return this.request('/writers/pending');
  }

  async approveWriter(writerId) {
    return this.request(`/writers/${writerId}/approve`, {
      method: 'PUT',
    });
  }

  async rejectWriter(writerId) {
    return this.request(`/writers/${writerId}/reject`, {
      method: 'PUT',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
