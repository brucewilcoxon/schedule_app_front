import { apiClient } from "./commonApi";

export interface UserProfile {
  id: number;
  name: string;
}

export interface RefrigerantCompany {
  id: number;
  item: string;
  process_type: "collection" | "filling" | "collection_filling";
  process_type_label: string;
  delivery_date: string;
  is_selected: boolean;
  owner?: string;
  manager_id?: number;
  manager?: {
    id: number;
    name: string;
  };
  residence?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRefrigerantCompanyData {
  item: string;
  process_type: "collection" | "filling" | "collection_filling";
  delivery_date: string;
  is_selected?: boolean;
  owner?: string;
  manager_id?: number;
  residence?: string;
}

export interface UpdateRefrigerantCompanyData extends CreateRefrigerantCompanyData {}

export const getUserProfiles = async (): Promise<UserProfile[]> => {
  const response = await apiClient.get("/api/user-profiles");
  return response.data.data;
};

export const getRefrigerantCompanies = async (): Promise<RefrigerantCompany[]> => {
  const response = await apiClient.get("/api/refrigerant-companies");
  return response.data.data;
};

export const createRefrigerantCompany = async (
  data: CreateRefrigerantCompanyData
): Promise<RefrigerantCompany> => {
  const response = await apiClient.post("/api/refrigerant-companies", data);
  return response.data.data;
};

export const updateRefrigerantCompany = async (
  id: number,
  data: UpdateRefrigerantCompanyData
): Promise<RefrigerantCompany> => {
  const response = await apiClient.put(`/api/refrigerant-companies/${id}`, data);
  return response.data.data;
};

export const deleteRefrigerantCompany = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/refrigerant-companies/${id}`);
}; 