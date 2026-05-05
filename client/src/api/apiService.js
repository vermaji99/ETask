import API from './axios';

/**
 * Auth Services
 */
export const authService = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  getMembers: () => API.get('/auth/members'),
};

/**
 * Project Services
 */
export const projectService = {
  getAll: () => API.get('/projects'),
  getById: (id) => API.get(`/projects/${id}`),
  create: (projectData) => API.post('/projects', projectData),
  delete: (id) => API.delete(`/projects/${id}`),
  addMember: (projectId, userId) => API.put(`/projects/${projectId}/members`, { userId }),
};

/**
 * Task Services
 */
export const taskService = {
  getByProject: (projectId) => API.get(`/tasks/project/${projectId}`),
  create: (taskData) => API.post('/tasks', taskData),
  updateStatus: (taskId, status) => API.put(`/tasks/${taskId}`, { status }),
  getStats: () => API.get('/tasks/stats'),
};
