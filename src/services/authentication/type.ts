import { BaseResponse } from '@/type';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse extends BaseResponse {
  data: AuthUser;
}

export interface ISignInCredentials {
  username: string;
  password: string;
}

export interface ISignUpCredentials {
  username: string;
  email: string;
  password: string;
}
