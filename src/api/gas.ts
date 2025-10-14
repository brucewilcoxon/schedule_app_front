import { GasType, GasFilter, GasApiResponse } from '../types/Gas';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export const gasApi = {
  // Get all gas data with filters
  async getGasData(filters?: GasFilter): Promise<GasApiResponse> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.gas_type) params.append('gas_type', filters.gas_type);
    if (filters?.prefecture) params.append('prefecture', filters.prefecture);
    if (filters?.process) params.append('process', filters.process);

    const response = await fetch(`${API_BASE_URL}/gas?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch gas data');
    }

    return response.json();
  },

  // Create new gas record
  async createGas(gasData: Omit<GasType, 'id' | 'created_at' | 'updated_at'>): Promise<GasType> {
    const response = await fetch(`${API_BASE_URL}/gas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gasData),
    });

    if (!response.ok) {
      throw new Error('Failed to create gas record');
    }

    return response.json();
  },

  // Update gas record
  async updateGas(id: number, gasData: Partial<GasType>): Promise<GasType> {
    const response = await fetch(`${API_BASE_URL}/gas/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gasData),
    });

    if (!response.ok) {
      throw new Error('Failed to update gas record');
    }

    return response.json();
  },

  // Delete gas record
  async deleteGas(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/gas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete gas record');
    }
  },

  // Get available gas types
  async getGasTypes(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/gas-types`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch gas types');
    }

    return response.json();
  },

  // Get available prefectures
  async getPrefectures(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/prefectures`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prefectures');
    }

    return response.json();
  },
};
