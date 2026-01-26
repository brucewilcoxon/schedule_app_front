import { CalendarType, CalendarWithoutId } from "../types/Calendar";
import { API_ROUTES, apiClient } from "./commonApi";

export const getCalendarEvent = async () => {
  const { data } = await apiClient.get<CalendarType[]>(
    API_ROUTES.CALENDAR.LIST
  );
  return data;
};

export const createCalendarEvent = async (values: CalendarWithoutId) => {
  const { data } = await apiClient.post<CalendarType>(
    API_ROUTES.CALENDAR.BASE,
    {
      vehicle_info: values.vehicle_info,
      repair_type: values.repair_type,
      work_type: values.work_type,
      workers: values.workers,
      status: values.status,
      description: values.description,
      start: values.start,
      end: values.end,
      time_period: values.time_period,
      is_delayed: values.is_delayed,
      images: values.images || [],
    }
  );
  return data;
};

export const updateCalendarEvent = async ({
  id,
  values,
}: {
  id: number;
  values: CalendarWithoutId;
}) => {
  const { data } = await apiClient.put<CalendarType>(
    `${API_ROUTES.CALENDAR.BASE}/${id}`,
    {
      vehicle_info: values.vehicle_info,
      repair_type: values.repair_type,
      work_type: values.work_type,
      workers: values.workers,
      status: values.status,
      description: values.description,
      start: values.start,
      end: values.end,
      time_period: values.time_period,
      is_delayed: values.is_delayed,
      images: values.images || [],
    }
  );
  return data;
};

export const deleteEvent = async (id: number) => {
  const { data } = await apiClient.delete<CalendarType>(
    `${API_ROUTES.CALENDAR.BASE}/${id}`
  );
  return data;
};
