import api from './api'
import type { ResponseModel } from '../shared/ResponseModel'
import type { TelemetryResponseDTO } from '../shared/telemetryTypes'

export const telemetryService = {
  /** 📋 Lista as últimas telemetrias do motor de inTropic */
  async listar(count = 50): Promise<TelemetryResponseDTO[]> {
    const r = await api.get<ResponseModel<TelemetryResponseDTO[]>>(`/telemetry?count=${count}`)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  },

  /** 🔍 Busca uma telemetria específica pelo ID */
  async buscarPorId(id: number): Promise<TelemetryResponseDTO> {
    const r = await api.get<ResponseModel<TelemetryResponseDTO>>(`/telemetry/${id}`)
    if (!r.data.status) throw new Error(r.data.mensagem)
    return r.data.dados
  }
}
