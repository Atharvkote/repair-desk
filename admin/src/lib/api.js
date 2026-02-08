import axios from 'axios'
import { authService } from '@/services/auth.service'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL; 

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
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
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('adminRefreshToken')
      
      if (!refreshToken) {
        // No refresh token, clear everything and reject
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRefreshToken')
        processQueue(error, null)
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        const response = await authService.refreshToken(refreshToken)
        
        if (response.success && response.accessToken) {
          localStorage.setItem('adminToken', response.accessToken)
          if (response.refreshToken) {
            localStorage.setItem('adminRefreshToken', response.refreshToken)
          }
          
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
          
          processQueue(null, response.accessToken)
          isRefreshing = false
          
          return api(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and reject
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRefreshToken')
        processQueue(refreshError, null)
        isRefreshing = false
        
        // Redirect to login if needed
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

