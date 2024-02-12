import { CommonTimestamp } from "./common";
import { BaseUser } from "./users";

export interface BaseChat extends CommonTimestamp {
  chatId: string;
  joinedUsers: Array<BaseUser> | [];
  latestMessage: string;
}

export interface BaseMessage {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
}

export type ChatReq = {
  firstId: string;
  secondId: string;
};

export type ChatRes = BaseChat;
