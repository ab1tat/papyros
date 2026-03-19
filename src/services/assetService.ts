import api from './api'
import type { ResponseModel } from '../shared/ResponseModel'
import type { AssetResponseDTO, AssetCriacaoDTO, EditarAssetDTO } from '../shared/assetTypes'

/** * 🗺️ Mapeamentos para converter texto do Front para números do C# 
 */
const MAP_TIPO: Record<string, number> = { 
  'OperatingSystem': 0, 'WebApplication': 1, 'Database': 2, 'API': 3, 'Network': 4, 'Other': 5 
};
const MAP_AMBIENTE: Record<string, number> = { 'DEV': 0, 'HML': 1, 'PROD': 2 };

export const assetService = {
  async listar(): Promise<AssetResponseDTO[]> {
    const r = await api.get<ResponseModel<AssetResponseDTO[]>>('/assets')
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async listarArquivados(): Promise<AssetResponseDTO[]> {
    const r = await api.get<ResponseModel<AssetResponseDTO[]>>('/assets/archived')
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async buscarPorId(id: number): Promise<AssetResponseDTO> {
    const r = await api.get<ResponseModel<AssetResponseDTO>>(`/assets/${id}`)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async criar(dto: AssetCriacaoDTO): Promise<AssetResponseDTO> {
    const payload = {
      ...dto,
      tipo: MAP_TIPO[dto.tipo as string] ?? 0,
      ambiente: MAP_AMBIENTE[dto.ambiente as string] ?? 0,
      habilitado: dto.habilitado ?? true
    };

    const r = await api.post<ResponseModel<AssetResponseDTO>>('/assets', payload)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async editar(id: number, dto: EditarAssetDTO): Promise<AssetResponseDTO> {
    const payload = {
      ...dto,
      ...(dto.tipo && { tipo: MAP_TIPO[dto.tipo as string] }),
      ...(dto.ambiente && { ambiente: MAP_AMBIENTE[dto.ambiente as string] }),
      ...(dto.habilitado !== undefined && { habilitado: dto.habilitado })
    };

    const r = await api.put<ResponseModel<AssetResponseDTO>>(`/assets/${id}`, payload)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  async arquivar(id: number): Promise<void> {
    await api.patch(`/assets/${id}/archive`)
  },

  async restaurar(id: number): Promise<void> {
    await api.patch(`/assets/${id}/restore`)
  },

  /** 🔗 Relação N:N */
  async adicionarVuln(assetId: number, vulnId: number): Promise<void> {
    await api.post(`/assets/${assetId}/vulns/${vulnId}`)
  },

  async removerVuln(assetId: number, vulnId: number): Promise<void> {
    await api.delete(`/assets/${assetId}/vulns/${vulnId}`)
  }
}