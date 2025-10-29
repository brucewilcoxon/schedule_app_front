import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../api/calendarApi";
import { toast } from "react-toastify";

export const useGetCalendarEvent = () => {
  return useQuery("calendarEvents", () => api.getCalendarEvent());
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(api.createCalendarEvent, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("calendarEvents");
      
      // Enhanced success message with event details
      const eventTitle = variables.vehicle_info || variables.repair_type || "スケジュール";
      const workers = variables.workers?.join(", ") || "未指定";
      
      toast.success(
        `📅 新しいスケジュールが作成されました\n${eventTitle}\n作業員: ${workers}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    },
    onError: () => {
      toast.error("作成に失敗しました");
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(api.updateCalendarEvent, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("calendarEvents");
      
      // Enhanced success message with event details
      const eventTitle = variables.values.vehicle_info || variables.values.repair_type || "スケジュール";
      const workers = variables.values.workers?.join(", ") || "未指定";
      
      toast.success(
        `✏️ スケジュールが更新されました\n${eventTitle}\n作業員: ${workers}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    },
    onError: () => {
      toast.error("カレンダーの編集に失敗しました");
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(api.deleteEvent, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("calendarEvents");
      
      // Enhanced success message with event details
      const eventTitle = data.vehicle_info || data.repair_type || "スケジュール";
      const workers = data.workers?.join(", ") || "未指定";
      
      toast.success(
        `🗑️ スケジュールが削除されました\n${eventTitle}\n作業員: ${workers}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    },
    onError: () => {
      toast.error("削除に失敗しました");
    },
  });
};
