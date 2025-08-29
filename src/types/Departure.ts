import { Calendar } from "@fullcalendar/core";
import { User } from "./user";
import { CalendarType } from "./Calendar";

export interface DepartureType {
  id?: number;
  date: string;
  start: string;
  end: string;
  intra_user_id?: number;
  intraUser?: User;
  description?: string;
  user?: User;
}

export interface DepartureWithTotalTime {
  departures: DepartureType[];
  total_time?: string;
}

export interface DepartureRankingType {
  user: User;
  departures_count: number;
}

export interface DepartureStatus {
  notified: NotifiedStatus[];
  no_notification: User[];
}

export interface NotifiedStatus {
  user: User;
  events: CalendarType[];
}
