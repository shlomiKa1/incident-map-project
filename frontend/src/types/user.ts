export type Role = "user" | "admin";

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse extends User {
  id: string;
  role: Role;
  createdAt: string;
}
