import axios from "axios";
import { IntraClaimType } from "../types/IntraClaim";
import { API_ROUTES, apiClient } from "./commonApi";

export const getIntraClaims = async () => {
  const { data } = await apiClient.get<IntraClaimType[]>(
    API_ROUTES.INTRA_CLAIM.LIST
  );
  return data;
};

export const showIntraClaim = async (id: number) => {
  const { data } = await apiClient.get<IntraClaimType>(
    `${API_ROUTES.INTRA_CLAIM.BASE}/${id}`
  );
  return data;
};

export const IntraApproveClaim = async (id: number) => {
  const { data } = await apiClient.post(
    `${API_ROUTES.INTRA_CLAIM.APPROVE}/${id}`
  );
  return data;
};

export const rejectIntraClaim = async (id: number) => {
  const { data } = await apiClient.post(
    `${API_ROUTES.INTRA_CLAIM.REJECT}/${id}`
  );
  return data;
};
