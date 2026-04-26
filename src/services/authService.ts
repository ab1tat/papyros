import api from './api'

interface LoginResponse {
  token: string
}

export const authService = {
  async login(username: string, password: string): Promise<string> {
    const response = await api.post<LoginResponse>('/auth/login', {
      username: username,
      password: password,
    })
    const token = response.data?.token
    if (!token) throw new Error('Token não retornado pela API.')
    localStorage.setItem('@aBitat:token', token)
    api.defaults.headers.Authorization = `Bearer ${token}`
    return token
  },

  logout() {
    localStorage.removeItem('@aBitat:token')
    delete api.defaults.headers.Authorization
    window.location.hash = '/login'
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('@aBitat:token')
  },
}
