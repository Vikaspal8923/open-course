import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthToken(this.token);
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        // Re-throw error with proper structure
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }

  clearAuthToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.put('/auth/profile', data);
    return response.data;
  }

  // Course endpoints
  async getCourses(query?: any) {
    const response = await this.client.get('/courses', { params: query });
    return response.data;
  }

  async getCourse(id: string) {
    const response = await this.client.get(`/courses/${id}`);
    return response.data;
  }

  async createCourse(data: any) {
    const response = await this.client.post('/courses', data);
    return response.data;
  }

  async updateCourse(id: string, data: any) {
    const response = await this.client.put(`/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await this.client.delete(`/courses/${id}`);
    return response.data;
  }

  async enrollCourse(id: string) {
    const response = await this.client.post(`/courses/${id}/enroll`);
    return response.data;
  }

  async getInstructorCourses(instructorId: string) {
    const response = await this.client.get(`/courses/instructor/${instructorId}`);
    return response.data;
  }

  // Lesson endpoints
  async getLessonsByCourse(courseId: string) {
    const response = await this.client.get(`/lessons/course/${courseId}`);
    return response.data;
  }

  async getLessons() {
    const response = await this.client.get('/lessons');
    return response.data;
  }

  async getLesson(id: string) {
    const response = await this.client.get(`/lessons/${id}`);
    return response.data;
  }

  async createLesson(data: any) {
    const response = await this.client.post('/lessons', data);
    return response.data;
  }

  async updateLesson(id: string, data: any) {
    const response = await this.client.put(`/lessons/${id}`, data);
    return response.data;
  }

  async deleteLesson(id: string) {
    const response = await this.client.delete(`/lessons/${id}`);
    return response.data;
  }

  // Interview endpoints
  async getInterviews(query?: any) {
    const response = await this.client.get('/interviews', { params: query });
    return response.data;
  }

  async getInterview(id: string) {
    const response = await this.client.get(`/interviews/${id}`);
    return response.data;
  }

  async createInterview(data: any) {
    const response = await this.client.post('/interviews', data);
    return response.data;
  }

  async updateInterview(id: string, data: any) {
    const response = await this.client.put(`/interviews/${id}`, data);
    return response.data;
  }

  async likeInterview(id: string) {
    const response = await this.client.post(`/interviews/${id}/like`);
    return response.data;
  }

  // Thread endpoints
  async getThreads(query?: any) {
    const response = await this.client.get('/threads', { params: query });
    return response.data;
  }

  async getThread(id: string) {
    const response = await this.client.get(`/threads/${id}`);
    return response.data;
  }

  async createThread(data: any) {
    const response = await this.client.post('/threads', data);
    return response.data;
  }

  async updateThread(id: string, data: any) {
    const response = await this.client.put(`/threads/${id}`, data);
    return response.data;
  }

  async deleteThread(id: string) {
    const response = await this.client.delete(`/threads/${id}`);
    return response.data;
  }

  async addComment(threadId: string, content: string) {
    const response = await this.client.post(`/threads/${threadId}/comments`, { content });
    return response.data;
  }

  async likeThread(id: string) {
    const response = await this.client.post(`/threads/${id}/like`);
    return response.data;
  }

  // Contribution endpoints
  async getContributions(query?: any) {
    const response = await this.client.get('/contributions', { params: query });
    return response.data;
  }

  async getContribution(id: string) {
    const response = await this.client.get(`/contributions/${id}`);
    return response.data;
  }

  async createContribution(data: any) {
    const response = await this.client.post('/contributions', data);
    return response.data;
  }

  async updateContribution(id: string, data: any) {
    const response = await this.client.put(`/contributions/${id}`, data);
    return response.data;
  }

  async deleteContribution(id: string) {
    const response = await this.client.delete(`/contributions/${id}`);
    return response.data;
  }

  async likeContribution(id: string) {
    const response = await this.client.post(`/contributions/${id}/like`);
    return response.data;
  }
}

export const api = new APIClient();
