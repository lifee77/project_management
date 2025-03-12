import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Projects
export const getProjects = () => api.get('/projects');
export const getProject = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: any) => api.post('/projects', data);
export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Sprints
export const getSprints = (projectId?: string) => {
  const params = projectId ? { projectId } : {};
  return api.get('/sprints', { params });
};
export const getSprint = (id: string) => api.get(`/sprints/${id}`);
export const createSprint = (data: any) => api.post('/sprints', data);
export const updateSprint = (id: string, data: any) => api.put(`/sprints/${id}`, data);
export const deleteSprint = (id: string) => api.delete(`/sprints/${id}`);

// Tasks
export const getTasks = (filters?: any) => api.get('/tasks', { params: filters });
export const getBacklogTasks = (projectId?: string) => {
  const params = projectId ? { projectId } : {};
  return api.get('/tasks/backlog', { params });
};
export const getTask = (id: string) => api.get(`/tasks/${id}`);
export const createTask = (data: any) => api.post('/tasks', data);
export const updateTask = (id: string, data: any) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);

export default api;
