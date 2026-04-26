export type VulnResponseDTO = {
  id: number
  titulo: string
  ambiente: 'DEV' | 'HML' | 'PROD'
  nivel: 'Baixa' | 'Media' | 'Alta' | 'Critica'
  status: 'Ativa' | 'Resolvida' | 'Arquivada'
  createdAt: string
}

export type VulnCriacaoDTO = {
  titulo: string
  ambiente: 'DEV' | 'HML' | 'PROD'
  nivel: 'Baixa' | 'Media' | 'Alta' | 'Critica'
  status: 'Ativa' | 'Resolvida' | 'Arquivada'
}

export type EditarVulnDTO = {
  titulo?: string
  ambiente?: 'DEV' | 'HML' | 'PROD'
  nivel?: 'Baixa' | 'Media' | 'Alta' | 'Critica'
  status?: 'Ativa' | 'Resolvida' | 'Arquivada'
}
