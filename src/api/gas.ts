import { GasType, GasFilter, GasApiResponse } from '../types/Gas';
import { apiClient } from './commonApi';

export const gasApi = {
  // Get all gas data with filters
  async getGasData(filters?: GasFilter): Promise<GasApiResponse> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.gas_type) params.append('gas_type', filters.gas_type);
    if (filters?.prefecture) params.append('prefecture', filters.prefecture);
    if (filters?.process) params.append('process', filters.process);

    const response = await apiClient.get(`/api/gas?${params.toString()}`);
    return response.data;
  },

  // Create new gas record
  async createGas(gasData: Omit<GasType, 'id' | 'created_at' | 'updated_at'>): Promise<GasType> {
    const response = await apiClient.post('/api/gas', gasData);
    return response.data;
  },

  // Update gas record
  async updateGas(id: number, gasData: Partial<GasType>): Promise<GasType> {
    const response = await apiClient.put(`/api/gas/${id}`, gasData);
    return response.data;
  },

  // Delete gas record
  async deleteGas(id: number): Promise<void> {
    await apiClient.delete(`/api/gas/${id}`);
  },

  // Get available gas types
  async getGasTypes(): Promise<string[]> {
    const response = await apiClient.get('/api/gas-types');
    return response.data;
  },

  // Get available prefectures
  async getPrefectures(): Promise<string[]> {
    const response = await apiClient.get('/api/prefectures');
    return response.data;
  },
};
