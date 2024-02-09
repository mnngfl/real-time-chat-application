import instance from "../utils/api";
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from "../types/users";

export const registerUser = async (
  data: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  return await instance.post("/users/register", data);
};

export const loginUser = async (
  data: LoginUserRequest
): Promise<LoginUserResponse> => {
  return await instance.post("/auth/login", data);
};
