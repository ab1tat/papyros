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

export function getSeverityColor(nivel: string): string {
  const map: Record<string, string> = {
    Critica: cyberColors.severity.critical,
    Alta:    cyberColors.severity.high,
    Media:   cyberColors.severity.medium,
    Baixa:   cyberColors.severity.low,
  }
  return map[nivel] ?? cyberColors.text.secondary
}

export function getSeverityLabel(nivel: string): string {
  const map: Record<string, string> = {
    Critica: 'CRITICAL',
    Alta:    'HIGH',
    Media:   'MEDIUM',
    Baixa:   'LOW',
  }
  return map[nivel] ?? nivel.toUpperCase()
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Ativa:     cyberColors.status.online,
    Resolvida: cyberColors.status.archived,
    Arquivada: cyberColors.status.archived,
  }
  return map[status] ?? cyberColors.text.secondary
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    Ativa:     'Active',
    Resolvida: 'Resolved',
    Arquivada: 'Archived',
  }
  return map[status] ?? status
}

export function getEnvColor(ambiente: string): string {
  return cyberColors.env[ambiente as keyof typeof cyberColors.env] ?? cyberColors.text.secondary
}
