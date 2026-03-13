import type { VulnResponseDTO } from './vulnTypes'

export type AssetResponseDTO = {
  id: number
  nome: string
  tipo: 'OperatingSystem' | 'WebApplication' | 'Database' | 'API' | 'Network' | 'Other'
  ambiente: 'DEV' | 'HML' | 'PROD'
  descricao?: string
  habilitado: boolean
  createdAt: string
  vulnerabilities?: VulnResponseDTO[]
}

export type AssetCriacaoDTO = {
  nome: string
  tipo: 'OperatingSystem' | 'WebApplication' | 'Database' | 'API' | 'Network' | 'Other'
  ambiente: 'DEV' | 'HML' | 'PROD'
  descricao?: string
}

export type EditarAssetDTO = {
  nome?: string
  tipo?: 'OperatingSystem' | 'WebApplication' | 'Database' | 'API' | 'Network' | 'Other'
  ambiente?: 'DEV' | 'HML' | 'PROD'
  descricao?: string
  habilitado?: boolean
}
