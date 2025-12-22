import { apiClient } from "./commonApi";

export interface RepairTypeOption {
  id: number;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRepairTypeOptionData {
  name: string;
  order?: number;
}

export interface UpdateRepairTypeOptionData extends CreateRepairTypeOptionData {}

export const getRepairTypeOptions = async (): Promise<RepairTypeOption[]> => {
  const response = await apiClient.get("/api/repair-type-options");
  return response.data;
};

export const createRepairTypeOption = async (
  data: CreateRepairTypeOptionData
): Promise<RepairTypeOption> => {
  const response = await apiClient.post("/api/repair-type-options", data);
  return response.data.data;
};

export const updateRepairTypeOption = async (
  id: number,
  data: UpdateRepairTypeOptionData
): Promise<RepairTypeOption> => {
  const response = await apiClient.put(`/api/repair-type-options/${id}`, data);
  return response.data.data;
};

export const deleteRepairTypeOption = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/repair-type-options/${id}`);
};

