import axios from 'axios';

/**
 * Skillfolio Centralized API Client
 * Configured with environment variable VITE_API_BASE_URL (defaults to http://localhost:8080)
 * Note on Token Storage: Access token is stored in localStorage for SPA navigation persistence.
 * Trade-off: Vulnerable to XSS if untrusted script executes in browser. Mitigated by strict sanitization and CSP.
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration or 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid looping if login attempt fails with 401
      const isAuthUrl = error.config.url.includes('/api/auth/login') || error.config.url.includes('/api/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('skillfolio_token');
        localStorage.removeItem('skillfolio_user');
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/p/')) {
          window.location.href = '/login?session_expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ==========================================
// API Service Methods
// ==========================================

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getCurrentUser: () => api.get('/api/auth/me'),
};

export const profileApi = {
  getMyProfile: () => api.get('/api/profile/me'),
  updateMyProfile: (data) => api.put('/api/profile/me', data),
  updateSlug: (portfolioSlug) => api.patch('/api/profile/me/slug', { portfolioSlug }),
  updatePublishStatus: (isPublished) => api.patch('/api/profile/me/publish', { isPublished }),
};

export const skillApi = {
  getSkills: (category) => api.get('/api/skills', { params: { category } }),
  getSkill: (id) => api.get(`/api/skills/${id}`),
  createSkill: (data) => api.post('/api/skills', data),
  updateSkill: (id, data) => api.put(`/api/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/api/skills/${id}`),
};

export const projectApi = {
  getProjects: () => api.get('/api/projects'),
  getProject: (id) => api.get(`/api/projects/${id}`),
  createProject: (data) => api.post('/api/projects', data),
  updateProject: (id, data) => api.put(`/api/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/projects/${id}`),
};

export const certificationApi = {
  getCertifications: () => api.get('/api/certifications'),
  getCertification: (id) => api.get(`/api/certifications/${id}`),
  createCertification: (data) => api.post('/api/certifications', data),
  updateCertification: (id, data) => api.put(`/api/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/api/certifications/${id}`),
};

export const achievementApi = {
  getAchievements: () => api.get('/api/achievements'),
  getAchievement: (id) => api.get(`/api/achievements/${id}`),
  createAchievement: (data) => api.post('/api/achievements', data),
  updateAchievement: (id, data) => api.put(`/api/achievements/${id}`, data),
  deleteAchievement: (id) => api.delete(`/api/achievements/${id}`),
};

export const dashboardApi = {
  getStudentDashboard: () => api.get('/api/dashboard/student'),
  getAdminDashboard: () => api.get('/api/dashboard/admin'),
};

export const publicApi = {
  getPublicPortfolio: (slug) => api.get(`/api/public/portfolio/${slug}`),
};

export const adminApi = {
  getStudents: (params) => api.get('/api/admin/students', { params }),
  getStudentDetail: (id) => api.get(`/api/admin/students/${id}`),
  updateStudentStatus: (id, active) => api.patch(`/api/admin/students/${id}/status`, { active }),
};
