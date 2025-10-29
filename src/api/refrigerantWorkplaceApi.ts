import { apiClient } from "./commonApi";

export interface RefrigerantWorkplace {
  id: number;
  business: string;
  residence?: string;
  vehicle_registration_number?: string;
  serial_number?: string;
  machine_type?: string;
  gas_type?: string;
  initial_fill_amount?: number;
  is_selected: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateRefrigerantWorkplaceData = Omit<RefrigerantWorkplace, "id" | "created_at" | "updated_at">;
export type UpdateRefrigerantWorkplaceData = CreateRefrigerantWorkplaceData;

export const getRefrigerantWorkplaces = async (): Promise<RefrigerantWorkplace[]> => {
  const res = await apiClient.get("/api/refrigerant-workplaces");
  return res.data.data;
};

export const createRefrigerantWorkplace = async (data: CreateRefrigerantWorkplaceData): Promise<RefrigerantWorkplace> => {
  const res = await apiClient.post("/api/refrigerant-workplaces", data);
  return res.data.data;
};

export const updateRefrigerantWorkplace = async (id: number, data: UpdateRefrigerantWorkplaceData): Promise<RefrigerantWorkplace> => {
  const res = await apiClient.put(`/api/refrigerant-workplaces/${id}`, data);
  return res.data.data;
};

export const deleteRefrigerantWorkplace = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/refrigerant-workplaces/${id}`);
}; 