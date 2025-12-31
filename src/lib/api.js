import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API Functions

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
  logout: () => api.post('/auth/logout'),
}

// School
export const schoolAPI = {
  getProfile: () => api.get('/school/profile'),
  createProfile: (data) => api.post('/school/profile', data),
  updateProfile: (id, data) => api.put(`/school/profile/${id}`, data),
}

// Students
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  updateStatus: (id, data) => api.put(`/students/${id}/status`, data),
  approve: (id) => api.put(`/students/${id}/approve`),
  promote: (data) => api.post('/students/promote', data),
}

// Teachers
export const teachersAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  assignSubjects: (id, data) => api.put(`/teachers/${id}/assign-subjects`, data),
  assignClasses: (id, data) => api.put(`/teachers/${id}/assign-classes`, data),
}

// Academic
export const academicAPI = {
  // Sessions
  getSessions: () => api.get('/academic/sessions'),
  createSession: (data) => api.post('/academic/sessions', data),
  updateSession: (id, data) => api.put(`/academic/sessions/${id}`, data),
  activateSession: (id) => api.put(`/academic/sessions/${id}/activate`),
  
  // Classes
  getClasses: (params) => api.get('/academic/classes', { params }),
  getClass: (id) => api.get(`/academic/classes/${id}`),
  createClass: (data) => api.post('/academic/classes', data),
  updateClass: (id, data) => api.put(`/academic/classes/${id}`, data),
  
  // Subjects
  getSubjects: (params) => api.get('/academic/subjects', { params }),
  createSubject: (data) => api.post('/academic/subjects', data),
  updateSubject: (id, data) => api.put(`/academic/subjects/${id}`, data),
  
  // Grading
  getGradingSystems: () => api.get('/academic/grading-systems'),
  createGradingSystem: (data) => api.post('/academic/grading-systems', data),
  
  // Timetables
  getTimetables: (params) => api.get('/academic/timetables', { params }),
  createTimetable: (data) => api.post('/academic/timetables', data),
  updateTimetable: (id, data) => api.put(`/academic/timetables/${id}`, data),
}

// Attendance
export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  getAll: (params) => api.get('/attendance', { params }),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  getReport: (params) => api.get('/attendance/report', { params }),
}

// Exams
export const examsAPI = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  publish: (id) => api.put(`/exams/${id}/publish`),
  
  // Results
  getResults: (params) => api.get('/exams/results/all', { params }),
  createResult: (data) => api.post('/exams/results', data),
  updateResult: (id, data) => api.put(`/exams/results/${id}`, data),
  publishResults: (data) => api.post('/exams/results/publish', data),
}

// Fees
export const feesAPI = {
  // Structures
  getStructures: (params) => api.get('/fees/structures', { params }),
  getStructure: (id) => api.get(`/fees/structures/${id}`),
  createStructure: (data) => api.post('/fees/structures', data),
  updateStructure: (id, data) => api.put(`/fees/structures/${id}`, data),
  
  // Payments
  getPayments: (params) => api.get('/fees/payments', { params }),
  getPayment: (id) => api.get(`/fees/payments/${id}`),
  createPayment: (data) => api.post('/fees/payments', data),
  updatePayment: (id, data) => api.put(`/fees/payments/${id}`, data),
  getPaymentSummary: (params) => api.get('/fees/payments/summary/student', { params }),
}

// Communication
export const communicationAPI = {
  getAnnouncements: (params) => api.get('/communication/announcements', { params }),
  getAnnouncement: (id) => api.get(`/communication/announcements/${id}`),
  createAnnouncement: (data) => api.post('/communication/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/communication/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/communication/announcements/${id}`),
  markAsRead: (id) => api.put(`/communication/announcements/${id}/read`),
}

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  updatePermissions: (id, data) => api.put(`/users/${id}/permissions`, data),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  delete: (id) => api.delete(`/users/${id}`),
}

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAttendanceChart: (params) => api.get('/dashboard/attendance-chart', { params }),
  getFeeChart: (params) => api.get('/dashboard/fee-chart', { params }),
}

