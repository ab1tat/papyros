import api from "./api";

// [CTO] Definição de interface para manter o contrato rígido com o .NET
interface LoginResponse {
  token: string;
}

export const authService = {
  async login(username: string, password: string): Promise<string> {
    // [CISO] Chamada para a API garantindo o corpo esperado pelo .NET (PascalCase)
    const response = await api.post<LoginResponse>("/api/auth/login", {
      Username: username,
      Password: password
    });

    // [CTO] Extração segura do token da resposta
    const token = response.data?.token;

    if (!token) {
      throw new Error("Falha na autenticação: Token não retornado pela API.");
    }

    // [CISO] Armazenamento padronizado com o Interceptor do api.ts
    localStorage.setItem("@SVSharp:token", token);
    
    // [CIO] Injeta o token nas próximas requisições desta sessão
    api.defaults.headers.Authorization = `Bearer ${token}`;

    return token;
  },

  logout() {
    // [CISO] Limpeza total do estado de autenticação
    localStorage.removeItem("@SVSharp:token");
    
    // Remove o header para que requisições futuras não enviem o token antigo
    if (api.defaults.headers.Authorization) {
      delete api.defaults.headers.Authorization;
    }

    // Redireciona para o login limpando o estado da SPA
    window.location.href = "/login";
  },

  // [CTO] Helper rápido para guardas de rota (Protected Routes)
  isAuthenticated(): boolean {
    return !!localStorage.getItem("@SVSharp:token");
  }
};