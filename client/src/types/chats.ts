import { type Timestamp } from "./common";
import { type BaseUser } from "./users";

export interface BaseChat extends Timestamp {
  _id: string;
  members: string[];
}

export interface PreviewChat extends Timestamp {
  chatId: string;
  joinedUsers: BaseUser[];
  latestMessage: string;
  latestMessageAt: string;
  unreadCount: number;
  notifications: BaseNotification[];
}

export interface CurrentChat extends BaseUser {
  userId: string;
}

export type ChatReq = {
  recipientId: string;
};

export type ChatRes = BaseChat;

export interface BaseMessage extends Timestamp {
  _id: string;
  chatId: string;
  sendUser: BaseUser;
  receiveUser: BaseUser;
  text: string;
}

export interface BaseNotification {
  _id: string[];
  unreadCount: number;
}
