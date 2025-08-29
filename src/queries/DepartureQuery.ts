import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/departureApi";
import { toast } from "react-toastify";

export const useGetDepartures = (
  userId?: number,
  year?: string,
  month?: string,
  date?: string
) => {
  return useQuery(["departures", userId, year, month, date], () =>
    api.getDepartures(userId, year, month, date)
  );
};

export const useCreateDepartureEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(api.createDepartureEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("departures");
      queryClient.invalidateQueries("notifications");
      toast.success("作成しました");
    },
    onError: () => {
      toast.error("作成に失敗しました");
    },
  });
};

export const useShowDeparture = (id: number) => {
  return useQuery(["departures", id], () => api.showDeparture(id));
};

export const useUpdateDeparture = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateDeparture, {
    onSuccess: () => {
      queryClient.invalidateQueries("departures");
      toast.success("出艇を編集しました");
    },
    onError: () => {
      toast.error("出艇の編集に失敗しました");
    },
  });
};

export const useDeleteDeparture = () => {
  const queryClient = useQueryClient();

  return useMutation(api.deleteDeparture, {
    onSuccess: () => {
      queryClient.invalidateQueries("departures");
      toast.success("削除しました");
    },
    onError: () => {
      toast.error("削除に失敗しました");
    },
  });
};

export const useGetDepartureRankings = (year?: string, month?: string) => {
  return useQuery(["departureRankings", year, month], () =>
    api.getDepartureRanking(year, month)
  );
};

export const useGetDepartureStatus = (enabled: boolean) => {
  return useQuery("departureStatus", () => api.getDepartureStatus(), {
    enabled: enabled,
  });
};
