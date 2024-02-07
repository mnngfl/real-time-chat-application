import instance from "../utils/api";
import { RegisterUserRequest, RegisterUserResponse } from "../types/users";

export const registerUser = async (
  data: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  return await instance.post("/users/register", data);
};
