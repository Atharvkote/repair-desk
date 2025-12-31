import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL; 

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTE1NjQwNzM4MGUzYWRmMWEyY2Q5OSIsInJvbGUiOiJhZG1pbiIsInBob25lIjoiOTg5NjU0MzIxMCIsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJpYXQiOjE3NjcwMzE0MjcsImV4cCI6MTc2NzYzNjIyN30.05dz3CW8V552sdbS3iL0GkD6jhpYuk3_dlzttdMdOZM"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    }
    return Promise.reject(error)
  }
)

export default api

