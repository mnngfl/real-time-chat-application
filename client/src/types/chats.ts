import { CommonTimestamp } from "./common";
import { BaseUser } from "./users";

export interface BaseChat extends CommonTimestamp {
  _id: string;
  members: Array<string>;
}

export interface PreviewChat extends CommonTimestamp {
  chatId: string;
  joinedUsers: Array<BaseUser> | [];
  latestMessage: string;
  latestMessageAt: string;
  unreadCount: number;
  notifications: Array<BaseNotification> | [];
}

export interface CurrentChat {
  _id: string;
  userId: string;
  userName: string;
  nickname?: string;
  avatar?: string;
}

export type ChatReq = {
  recipientId: string;
};

export type ChatRes = BaseChat;

export interface BaseMessage extends CommonTimestamp {
  _id: string;
  chatId: string;
  sendUser: BaseUser;
  receiveUser: BaseUser;
  text: string;
}

export interface MessageReq {
  chatId: string;
  text: string;
}

export interface MessageRes extends CommonTimestamp {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
}

export interface BaseNotification {
  _id: Array<string>;
  unreadCount: number;
}
