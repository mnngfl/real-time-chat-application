import instance from "../utils/api";
import {
  FindUserRes,
  GetUsersRes,
  LoginUserReq,
  LoginUserRes,
  RegisterUserReq,
  RegisterUserRes,
} from "../types/users";

export const registerUser = async (
  data: RegisterUserReq
): Promise<RegisterUserRes> => {
  return await instance.post("/auth/register", data);
};

export const loginUser = async (data: LoginUserReq): Promise<LoginUserRes> => {
  return await instance.post("/auth/login", data);
};

export const findUser = async (userId: string): Promise<FindUserRes> => {
  return await instance.get(`/users/find/${userId}`);
};

export const getOtherUsers = async (): Promise<Array<GetUsersRes>> => {
  return await instance.get("/users/others");
};
