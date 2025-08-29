import { User } from "./user";

export interface CalendarWithoutId {
  start: string;
  end: string;
  vehicle_info?: string;
  repair_type?: string;
  workers?: string[];
  status?: string;
  description?: string;
  is_delayed?: boolean;
  is_absent?: boolean;
}

export interface CalendarType {
  id: number;
  user: User;
  start: string;
  end: string;
  vehicle_info?: string;
  repair_type?: string;
  workers?: string[];
  status?: string;
  description?: string;
  is_delayed?: boolean;
  is_absent?: boolean;
}
