import type { BaseMessage, ChatReq, ChatRes, MessageReq, MessageRes, PreviewChat } from "../types/chats";
import { CommonPagination } from "../types/common";
import instance from "../utils/api";

export const createChat = async (data: ChatReq): Promise<ChatRes> => {
  return await instance.post("/chats", data);
};

export const searchUserChats = async (search?: string): Promise<Array<PreviewChat>> => {
  return await instance.get(search ? `/chats?search=${search}` : "/chats");
};

export const deleteNotifications = async (chatId: string): Promise<number> => {
  return await instance.delete(`/chats/notify/${chatId}`);
};

export const findMessages = async (
  chatId: string,
  page: number = 1
): Promise<{ data: Array<BaseMessage>; pageInfo: CommonPagination }> => {
  return await instance.get(`/messages/${chatId}?page=${page}`);
};

export const sendMessage = async (data: MessageReq): Promise<MessageRes> => {
  return await instance.post("/messages/", data);
};
