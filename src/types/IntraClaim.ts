import { User } from "./user";

export interface IntraClaimType {
  id: number;
  status: string;
  intra_user_id: number;
  user: User;
  intra_user: User;
}
