export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshSessionRequest {
  refreshToken?: string;
  expiresInMins?: number;
}

export interface RefreshSessionResponse {
  accessToken: string;
  refreshToken: string;
}
