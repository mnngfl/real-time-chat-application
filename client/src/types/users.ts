export interface RegisterUserRequest {
  userName: string;
  password: string;
  passwordConfirm: string;
}

export interface RegisterUserResponse {
  _id: string;
  userName: string;
}
