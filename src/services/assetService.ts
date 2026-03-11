import api from './api';

// [CIO] Interface atualizada para suportar os status de severidade do Dashboard
export interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;   // [CTO] Campo essencial para o mapeamento de cores neon
  isActive: boolean;
}

export const assetService = {
  // [CTO] GET /api/Assets
  async getAll(): Promise<Asset[]> {
    const response = await api.get<Asset[]>('/api/Assets');
    return response.data;
  },

  // [CISO] POST /api/Assets
  async create(asset: Partial<Asset>): Promise<Asset> {
    const response = await api.post<Asset>('/api/Assets', asset);
    return response.data;
  },

  // [CTO] DELETE /api/Assets/{id} (Soft Delete)
  async delete(id: number): Promise<void> {
    await api.delete(`/api/Assets/${id}`);
  }
};