import axios from 'axios'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  validateToken: () => api.get('/auth/validate'),
  logout: () => {
    localStorage.removeItem('token')
  }
}

export const checklistAPI = {
  generateQuestions: (topic) => api.post('/checklist/questions', { topic }),
  generateChecklist: (topic, answers) => api.post('/checklist/generate', { topic, answers }),
  getAllChecklists: () => api.get('/checklist/all'),
  getChecklist: (id) => api.get(`/checklist/${id}`),
  updateChecklist: (id, data) => api.put(`/checklist/${id}`, data),
  deleteChecklist: (id) => api.delete(`/checklist/${id}`),
  updateItem: (checklistId, sectionId, itemId, done) => 
    api.put(`/checklist/${checklistId}/item`, { sectionId, itemId, done }),
}

export default api
