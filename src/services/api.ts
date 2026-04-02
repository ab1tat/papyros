import axios from 'axios'

const api = axios.create({
  baseURL: 'https://rapsodia-roij.onrender.com/api',
  timeout: 60000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@aBitat:token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@aBitat:token')
      window.location.hash = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
