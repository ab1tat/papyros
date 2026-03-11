import axios from "axios";

const api = axios.create({
  // [CTO] Usando a variável de ambiente do Vite
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5073',
  timeout: 10000
});

// [CISO] Interceptor de REQUISIÇÃO: Envia o crachá em cada chamada
api.interceptors.request.use((config) => {
  // Ajustado para ler a chave correta que você definiu no authService
  const token = localStorage.getItem("@SVSharp:token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// [CISO] Interceptor de RESPOSTA: Se a API disser "não te conheço" (401), desloga
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa a chave correta
      localStorage.removeItem("@SVSharp:token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;