import api from './api'
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
}
