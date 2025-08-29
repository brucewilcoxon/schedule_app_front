import { DepartureType } from "./Departure";
import { User } from "./user";

export interface IntraClaimType {
  id: number;
  status: string;
  intra_user_id: number;
  departure_id: number;
  departure: DepartureType;
  user: User;
  intra_user: User;
}
