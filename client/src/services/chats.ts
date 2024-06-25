import type { BaseMessage, ChatReq, ChatRes, PreviewChat } from "../types/chats";
import type { ApiResponse } from "../types/common";
import instance from "../utils/api";

export const createChat = async (data: ChatReq): Promise<ApiResponse<ChatRes>> => {
  return await instance.post("/chats", data);
};

export const searchUserChats = async (search?: string): Promise<ApiResponse<PreviewChat[]>> => {
  return await instance.get(search ? `/chats?search=${search}` : "/chats");
};

export const deleteNotifications = async (chatId: string): Promise<ApiResponse<number>> => {
  return await instance.delete(`/chats/notify/${chatId}`);
};

export const findMessages = async (chatId: string, page: number = 1): Promise<ApiResponse<BaseMessage[]>> => {
  return await instance.get(`/messages/${chatId}?page=${page}`);
};
