export interface UserInfo {
  email: string;
  name: string;
  userId?: number;
}

export interface AuthState {
  userInfo: UserInfo;
  token?: string;
  tokenValidBefore?: string;
}

export type LoginResponse =
  | {
      loginResult: true;
      userInfo: UserInfo;
      token?: string;
      tokenValidBefore?: string;
    }
  | { loginResult: false; failCode?: number };

export interface CheckEmailResponse {
  available: boolean;
}

export interface SignupResponse {
  ok: boolean;
  message?: string;
}
