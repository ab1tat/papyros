import api from './api'
import type { ResponseModel } from '../shared/ResponseModel'
import type { AssetResponseDTO, AssetCriacaoDTO, EditarAssetDTO } from '../shared/assetTypes'

export const assetService = {
  async listar(): Promise<AssetResponseDTO[]> {
    const r = await api.get<ResponseModel<AssetResponseDTO[]>>('/assets')
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async buscarPorId(id: number): Promise<AssetResponseDTO> {
    const r = await api.get<ResponseModel<AssetResponseDTO>>(`/assets/${id}`)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async criar(dto: AssetCriacaoDTO): Promise<AssetResponseDTO> {
    const r = await api.post<ResponseModel<AssetResponseDTO>>('/assets', dto)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async editar(id: number, dto: EditarAssetDTO): Promise<AssetResponseDTO> {
    const r = await api.put<ResponseModel<AssetResponseDTO>>(`/assets/${id}`, dto)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async arquivar(id: number): Promise<void> {
    await api.patch(`/assets/${id}/archive`)
  },

  async restaurar(id: number): Promise<void> {
    await api.patch(`/assets/${id}/restore`)
  },

  async adicionarVuln(assetId: number, vulnId: number): Promise<void> {
    await api.post(`/assets/${assetId}/vulnerabilities/${vulnId}`)
  },

  async removerVuln(assetId: number, vulnId: number): Promise<void> {
    await api.delete(`/assets/${assetId}/vulnerabilities/${vulnId}`)
  },
}
