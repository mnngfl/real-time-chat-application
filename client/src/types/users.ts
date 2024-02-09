export interface RegisterUserRequest {
  userName: string;
  password: string;
  passwordConfirm: string;
}

export interface RegisterUserResponse {
  _id: string;
  userName: string;
}

export interface LoginUserRequest {
  userName: string;
  password: string;
}

export interface LoginUserResponse {
  _id: string;
  userName: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
