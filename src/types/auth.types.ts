export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  companyId?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  accessToken: string;
  user?: AuthUser;
}
