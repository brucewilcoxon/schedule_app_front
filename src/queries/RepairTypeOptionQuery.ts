import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getRepairTypeOptions,
  createRepairTypeOption,
  updateRepairTypeOption,
  deleteRepairTypeOption,
  RepairTypeOption,
  CreateRepairTypeOptionData,
  UpdateRepairTypeOptionData,
} from "../api/repairTypeOptionApi";
import { toast } from "react-toastify";

export const useGetRepairTypeOptions = () => {
  return useQuery<RepairTypeOption[]>(
    ["repairTypeOptions"],
    getRepairTypeOptions,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useCreateRepairTypeOption = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateRepairTypeOptionData) => createRepairTypeOption(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["repairTypeOptions"]);
        toast.success("修理の種類が追加されました");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "修理の種類の追加に失敗しました";
        toast.error(message);
      },
    }
  );
};

export const useUpdateRepairTypeOption = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: number; data: UpdateRepairTypeOptionData }) =>
      updateRepairTypeOption(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["repairTypeOptions"]);
        toast.success("修理の種類が更新されました");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "修理の種類の更新に失敗しました";
        toast.error(message);
      },
    }
  );
};

export const useDeleteRepairTypeOption = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: number) => deleteRepairTypeOption(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["repairTypeOptions"]);
        toast.success("修理の種類が削除されました");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "修理の種類の削除に失敗しました";
        toast.error(message);
      },
    }
  );
};

