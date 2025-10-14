export interface User {
  id: number;
  email: string;
  user_profile?: {
    id?: number;
    name?: string | undefined;
    gender?: string | undefined;
    age?: string | undefined;
    introduction?: string | undefined;
    profile_image?: string | undefined;
  };
  role: string;
}

export type Profile = {
  email?: string | undefined;
  name?: string | undefined;
  gender?: string | undefined;
  age?: string | undefined;
  introduction?: string | undefined;
  profile_image?: string | undefined;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
