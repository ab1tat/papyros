/*import api from './api'
import type { ResponseModel } from '../shared/ResponseModel'
import type { VulnResponseDTO, VulnCriacaoDTO, EditarVulnDTO } from '../shared/vulnTypes'

export const vulnService = {
  async listar(): Promise<VulnResponseDTO[]> {
    const r = await api.get<ResponseModel<VulnResponseDTO[]>>('/vulns')
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async buscarPorId(id: number): Promise<VulnResponseDTO> {
    const r = await api.get<ResponseModel<VulnResponseDTO>>(`/vulns/${id}`)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async criar(dto: VulnCriacaoDTO): Promise<VulnResponseDTO> {
    const r = await api.post<ResponseModel<VulnResponseDTO>>('/vulns', dto)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async editar(id: number, dto: EditarVulnDTO): Promise<VulnResponseDTO> {
    const r = await api.put<ResponseModel<VulnResponseDTO>>(`/vulns/${id}`, dto)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async arquivar(id: number): Promise<void> {
    await api.patch(`/vulns/${id}/archive`)
  },

  async restaurar(id: number): Promise<void> {
    await api.patch(`/vulns/${id}/restore`)
  },
} */
import api from './api'
import type { ResponseModel } from '../shared/ResponseModel'
import type { VulnResponseDTO, VulnCriacaoDTO, EditarVulnDTO } from '../shared/vulnTypes'

/**
 * 🗺️ Mapeamentos para converter as strings do Frontend nos Enums do Backend (C#)
 * A sequência segue a ordem definida no arquivo Vuln.cs (Baixa=0, Media=1, etc.)
 */
const MAP_NIVEL: Record<string, number> = { 'Baixa': 0, 'Media': 1, 'Alta': 2, 'Critica': 3 };
const MAP_AMBIENTE: Record<string, number> = { 'DEV': 0, 'HML': 1, 'PROD': 2 };
const MAP_STATUS: Record<string, number> = { 'Ativa': 0, 'Resolvida': 1, 'Arquivada': 2 };

export const vulnService = {
  /** 📋 Lista todas as vulnerabilidades */
  async listar(): Promise<VulnResponseDTO[]> {
    const r = await api.get<ResponseModel<VulnResponseDTO[]>>('/vulns')
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  /** 🔍 Busca uma vulnerabilidade específica pelo ID */
  async buscarPorId(id: number): Promise<VulnResponseDTO> {
    const r = await api.get<ResponseModel<VulnResponseDTO>>(`/vulns/${id}`)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  /** ➕ Cria uma nova vulnerabilidade com tradução automática para Enums */
  async criar(dto: VulnCriacaoDTO): Promise<VulnResponseDTO> {
    const payload = {
      ...dto,
      nivel: MAP_NIVEL[dto.nivel],
      ambiente: MAP_AMBIENTE[dto.ambiente],
      status: MAP_STATUS[dto.status]
    };

    const r = await api.post<ResponseModel<VulnResponseDTO>>('/vulns', payload)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  /** ✏️ Edita uma vulnerabilidade existente */
  async editar(id: number, dto: EditarVulnDTO): Promise<VulnResponseDTO> {
    const payload = {
      ...dto,
      // Só mapeia se o campo existir no DTO de edição
      ...(dto.nivel !== undefined && { nivel: MAP_NIVEL[dto.nivel] }),
      ...(dto.ambiente !== undefined && { ambiente: MAP_AMBIENTE[dto.ambiente] }),
      ...(dto.status !== undefined && { status: MAP_STATUS[dto.status] })
    };

    const r = await api.put<ResponseModel<VulnResponseDTO>>(`/vulns/${id}`, payload)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  /** 📁 Arquiva uma vulnerabilidade (muda status para Arquivada) */
  async arquivar(id: number): Promise<void> {
    await api.patch(`/vulns/${id}/archive`)
  },

  /** ♻️ Restaura uma vulnerabilidade arquivada */
  async restaurar(id: number): Promise<void> {
    await api.patch(`/vulns/${id}/restore`)
  },
}