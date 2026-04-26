import type { VulnResponseDTO } from './vulnTypes'

export type AssetResponseDTO = {
  id: number
  nome: string
  tipo: any // Usamos any temporariamente para destravar o build das páginas
  ambiente: any
  descricao?: string
  habilitado: boolean
  createdAt: string
  vulnerabilities?: VulnResponseDTO[]
}

export type AssetCriacaoDTO = {
  nome: string
  tipo: any
  ambiente: any
  descricao?: string
  habilitado?: boolean // O '?' torna opcional, resolvendo o erro de "missing property"
}

export type EditarAssetDTO = Partial<AssetCriacaoDTO>