import instance from "../utils/api";
import {
  FindUserRes,
  LoginUserReq,
  LoginUserRes,
  RegisterUserReq,
  RegisterUserRes,
  UserToken,
} from "../types/users";

export const registerUser = async (
  data: RegisterUserReq
): Promise<RegisterUserRes> => {
  return await instance.post("/auth/register", data);
};

export const loginUser = async (data: LoginUserReq): Promise<LoginUserRes> => {
  return await instance.post("/auth/login", data);
};

export const refreshToken = async (token: UserToken): Promise<UserToken> => {
  return await instance.post("/auth/refresh-token", token);
};

export const findUser = async (userId: string): Promise<FindUserRes> => {
  return await instance.get(`/users/find/${userId}`);
};
