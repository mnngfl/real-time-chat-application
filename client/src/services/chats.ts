import {
  BaseMessage,
  ChatReq,
  ChatRes,
  MessageReq,
  MessageRes,
  PreviewChat,
} from "../types/chats";
import instance from "../utils/api";

export const createChat = async (data: ChatReq): Promise<ChatRes> => {
  return await instance.post("/chats", data);
};

export const findUserChats = async (): Promise<Array<PreviewChat>> => {
  return await instance.get(`/chats`);
};

export const findChat = async (chatId: string): Promise<ChatRes> => {
  return await instance.get(`/chats/${chatId}`);
};

export const findMessages = async (
  chatId: string
): Promise<Array<BaseMessage>> => {
  return await instance.get(`/messages/${chatId}`);
};

export const sendMessage = async (data: MessageReq): Promise<MessageRes> => {
  return await instance.post("/messages/", data);
};
