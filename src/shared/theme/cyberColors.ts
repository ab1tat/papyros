export const cyberColors = {
  background: '#0b1222',
  card: '#101e35',
  border: '#1a2d4a',

  text: {
    primary:   '#e2ecf7',
    secondary: '#7b96b8',
  },

  severity: {
    critical: '#e63946',
    high:     '#f4a261',
    medium:   '#4895ef',
    low:      '#06d6a0',
  },

  status: {
    online:      '#06d6a0',
    offline:     '#e63946',
    warning:     '#f4a261',
    maintenance: '#f4a261',
    archived:    '#64748b',
  },

  env: {
    DEV:  '#4895ef',
    HML:  '#06d6a0',
    PROD: '#0096c7',
  },

  effects: {
    glowCritical: 'rgba(230, 57, 70, 0.2)',
    glowHigh:     'rgba(244, 162, 97, 0.2)',
    glowMedium:   'rgba(72, 149, 239, 0.2)',
    glowLow:      'rgba(6, 214, 160, 0.2)',
  },
}

// 🔄 Mapeadores reversos para tratar números vindos do Backend
const NIVEL_REVERSO: Record<string | number, string> = {
  0: 'Baixa', 1: 'Media', 2: 'Alta', 3: 'Critica',
  'Baixa': 'Baixa', 'Media': 'Media', 'Alta': 'Alta', 'Critica': 'Critica'
};

const STATUS_REVERSO: Record<string | number, string> = {
  0: 'Ativa', 1: 'Resolvida', 2: 'Arquivada',
  'Ativa': 'Ativa', 'Resolvida': 'Resolvida', 'Arquivada': 'Arquivada'
};

const ENV_REVERSO: Record<string | number, string> = {
  0: 'DEV', 1: 'HML', 2: 'PROD',
  'DEV': 'DEV', 'HML': 'HML', 'PROD': 'PROD'
};

export function getSeverityColor(nivel: string | number): string {
  const nomeNivel = NIVEL_REVERSO[nivel] || 'Baixa';
  const map: Record<string, string> = {
    Critica: cyberColors.severity.critical,
    Alta:    cyberColors.severity.high,
    Media:   cyberColors.severity.medium,
    Baixa:   cyberColors.severity.low,
  }
  return map[nomeNivel] ?? cyberColors.text.secondary
}

export function getSeverityLabel(nivel: string | number): string {
  const nomeNivel = NIVEL_REVERSO[nivel] || 'Baixa';
  const map: Record<string, string> = {
    Critica: 'CRITICAL',
    Alta:    'HIGH',
    Media:   'MEDIUM',
    Baixa:   'LOW',
  }
  return map[nomeNivel] ?? String(nivel).toUpperCase()
}

export function getStatusColor(status: string | number): string {
  const nomeStatus = STATUS_REVERSO[status] || 'Ativa';
  const map: Record<string, string> = {
    Ativa:     cyberColors.status.online,
    Resolvida: cyberColors.status.archived,
    Arquivada: cyberColors.status.archived,
  }
  return map[nomeStatus] ?? cyberColors.text.secondary
}

export function getStatusLabel(status: string | number): string {
  const nomeStatus = STATUS_REVERSO[status] || 'Ativa';
  const map: Record<string, string> = {
    Ativa:     'Active',
    Resolvida: 'Resolved',
    Arquivada: 'Archived',
  }
  return map[nomeStatus] ?? String(status)
}

export function getEnvColor(ambiente: string | number): string {
  const nomeEnv = ENV_REVERSO[ambiente] || 'DEV';
  return cyberColors.env[nomeEnv as keyof typeof cyberColors.env] ?? cyberColors.text.secondary
}