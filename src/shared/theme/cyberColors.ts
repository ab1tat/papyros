/**
 * [CIO] Design System Centralizado - SVSharp
 * Definição de cores e efeitos para manter a consistência visual em todo o projeto.
 */
export const cyberColors = {
  // Fundo Navy Profundo (Base do Dashboard)
  background: '#0B1120', 
  
  // Containers e Cards
  card: '#16213E',       
  
  // Linhas divisórias e bordas sutis
  border: '#1E293B',     
  
  // Tipografia
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8', 
  },

  // [CTO] Escala de Severidade (Mapeada da imagem de referência)
  severity: {
    critical: '#F87171', // Vermelho/Rosa Neon
    high: '#FB923C',     // Laranja Vibrante
    medium: '#3B82F6',   // Azul Elétrico
    low: '#10B981',      // Verde Esmeralda
  },

  // [CISO] Status de Conectividade e Integridade do Sistema
  status: {
    online: '#10B981',
    offline: '#EF4444',
    warning: '#F59E0B',
  },

  // Efeitos Visuais de Profundidade e Glow
  effects: {
    glowCritical: 'rgba(248, 113, 113, 0.2)',
    glowHigh: 'rgba(251, 146, 60, 0.2)',
    glowMedium: 'rgba(59, 130, 246, 0.2)',
    glass: 'rgba(22, 33, 62, 0.8)',
  }
};