import { User } from "./user";

export interface WindQuestion {
  content: string;
}

export interface WindIdQuestion {
  id: number;
  content: string;
  answers: WindIdQuestion[];
  user: User;
  created_at: string;
}

export interface WindAnswer {
  content: string;
}
export interface WindIdAnswer {
  id: number;
  content: string;
  user: User;
  created_at: string;
}
