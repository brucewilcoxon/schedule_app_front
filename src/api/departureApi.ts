import axios from "axios";
import {
  DepartureRankingType,
  DepartureStatus,
  DepartureType,
  DepartureWithTotalTime,
} from "../types/Departure";
import { API_ROUTES, apiClient } from "./commonApi";

export const getDepartures = async (
  userId?: number,
  year?: string,
  month?: string,
  date?: string
) => {
  const { data } = await apiClient.get<DepartureWithTotalTime>(
    API_ROUTES.DEPARTURE.LIST,
    {
      params: {
        user_id: userId,
        year: year,
        month: month,
        date: date,
      },
    }
  );
  return data;
};

export const createDepartureEvent = async (
  values: Omit<DepartureType, "date">
) => {
  const { data } = await apiClient.post<Omit<DepartureType, "date">>(
    API_ROUTES.DEPARTURE.BASE,
    {
      intra_user_id: values.intra_user_id,
      start: values.start,
      end: values.end,
      description: values.description,
    }
  );
  return data;
};

export const showDeparture = async (id: number) => {
  const { data } = await apiClient.get<DepartureType>(
    `${API_ROUTES.DEPARTURE.BASE}/${id}`
  );
  return data;
};

export const updateDeparture = async ({
  id,
  values,
}: {
  id: number;
  values: Omit<DepartureType, "date">;
}) => {
  const { data } = await apiClient.put<Omit<DepartureType, "date">>(
    `${API_ROUTES.DEPARTURE.BASE}/${id}`,
    values
  );
  return data;
};
export const getDepartureRanking = async (year?: string, month?: string) => {
  const { data } = await apiClient.get<DepartureRankingType[]>(
    API_ROUTES.DEPARTURE.RANKINGS,
    {
      params: {
        year: year,
        month: month,
      },
    }
  );
  return data;
};
export const deleteDeparture = async (id: number) => {
  const { data } = await apiClient.delete<DepartureType>(
    `${API_ROUTES.DEPARTURE.BASE}/${id}`
  );
  return data;
};

export const getDepartureStatus = async () => {
  const { data } = await apiClient.get<DepartureStatus>(
    API_ROUTES.DEPARTURE.STATUS
  );
  return data;
};
