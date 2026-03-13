export interface ResponseModel<T> {
  dados: T
  mensagem: string
  status: boolean
}

export interface LoginResponse {
  token: string
}

export interface Asset {
  id: number
  nome: string
  tipo: 'OperatingSystem' | 'WebApplication' | 'Database' | 'API' | 'Network' | 'Other'
  ambiente: 'DEV' | 'HML' | 'PROD'
  habilitado: boolean
  createdAt: string
}

export interface Vuln {
  id: number
  titulo: string
  ambiente: 'DEV' | 'HML' | 'PROD'
  nivel: 'Baixa' | 'Media' | 'Alta' | 'Critica'
  status: 'Ativa' | 'Resolvida' | 'Arquivada'
  createdAt: string
}

export interface AssetVuln {
  assetId: number
  vulnId: number
  createdAt: string
  asset?: Asset
  vuln?: Vuln
}
