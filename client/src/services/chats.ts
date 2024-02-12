import { ChatReq, ChatRes } from "../types/chats";
import instance from "../utils/api";

export const createChat = async (data: ChatReq): Promise<ChatRes> => {
  return await instance.post("/", data);
};

export const findUserChats = async (
  userId: string
): Promise<Array<ChatRes>> => {
  return await instance.get(`/chats/${userId}`);
};

export const findChat = async (
  firstId: string,
  secondId: string
): Promise<ChatRes> => {
  return await instance.get(`/chats/find/${firstId}/${secondId}`);
};
