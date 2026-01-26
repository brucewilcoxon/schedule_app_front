import { User } from "./user";

export interface CalendarWithoutId {
  start: string;
  end: string;
  time_period?: string;
  vehicle_info?: string;
  repair_type?: string;
  work_type?: string;
  workers?: string[];
  status?: string;
  description?: string;
  is_delayed?: boolean;
  is_absent?: boolean;
  images?: string[];
}

export interface CalendarType {
  id: number;
  user: User;
  start: string;
  end: string;
  time_period?: string;
  vehicle_info?: string;
  repair_type?: string;
  work_type?: string;
  workers?: string[];
  status?: string;
  description?: string;
  is_delayed?: boolean;
  is_absent?: boolean;
  created_at?: string;
  images?: string[];
}
