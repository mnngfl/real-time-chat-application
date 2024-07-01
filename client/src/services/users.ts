import instance from "../utils/api";
import type {
  FindUserRes,
  GetUsersRes,
  LoginUserReq,
  LoginUserRes,
  RegisterUserReq,
  RegisterUserRes,
} from "../types/users";
import type { ApiResponse, QueryResponse } from "../types/common";

export const registerUser = async (data: RegisterUserReq): Promise<ApiResponse<RegisterUserRes>> => {
  return await instance.post("/auth/register", data);
};

export const checkUserNameDuplicate = async (userName: string): Promise<ApiResponse<boolean>> => {
  return await instance.get(`/auth/check-id/${userName}`);
};

export const loginUser = async (data: LoginUserReq): Promise<ApiResponse<LoginUserRes>> => {
  return await instance.post("/auth/login", data);
};

export const getProfile = async (): Promise<ApiResponse<FindUserRes>> => {
  return await instance.get("/users/profile");
};

export const getOtherUsers = async (): Promise<ApiResponse<GetUsersRes[]>> => {
  return await instance.get("/users/others");
};

export const checkValidateNickname = async (nickname: string): Promise<ApiResponse<boolean>> => {
  return await instance.get(`/users/validate/${nickname}`);
};

export const updateUserName = async (nickname: string): Promise<QueryResponse> => {
  return await instance.put(`/users/update-name/${nickname}`);
};

export const updateAvatar = async (avatar: string): Promise<QueryResponse> => {
  return await instance.put(`/users/update-avatar/${avatar}`);
};
