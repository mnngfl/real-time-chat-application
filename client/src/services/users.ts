import instance from "../utils/api";
import type {
  FindUserRes,
  GetUsersRes,
  LoginUserReq,
  LoginUserRes,
  RegisterUserReq,
  RegisterUserRes,
} from "../types/users";
import { CommonQueryRes } from "../types/common";

export const registerUser = async (data: RegisterUserReq): Promise<RegisterUserRes> => {
  return await instance.post("/auth/register", data);
};

export const checkUserNameDuplicate = async (userName: string): Promise<boolean> => {
  return await instance.get(`/auth/check-id/${userName}`);
};

export const loginUser = async (data: LoginUserReq): Promise<LoginUserRes> => {
  return await instance.post("/auth/login", data);
};

export const getProfile = async (): Promise<FindUserRes> => {
  return await instance.get("/users/profile");
};

export const getOtherUsers = async (): Promise<Array<GetUsersRes>> => {
  return await instance.get("/users/others");
};

export const checkValidateNickname = async (nickname: string): Promise<boolean> => {
  return await instance.get(`/users/validate/${nickname}`);
};

export const updateUserName = async (nickname: string): Promise<CommonQueryRes> => {
  return await instance.put(`/users/update-name/${nickname}`);
};

export const updateAvatar = async (avatar: string): Promise<CommonQueryRes> => {
  return await instance.put(`/users/update-avatar/${avatar}`);
};
