import { atom } from "recoil";
import { BaseMessage, CurrentChat, PreviewChat } from "../../types/chats";

export const chatListState = atom<Array<PreviewChat>>({
  key: "chatState",
  default: [],
});

export const currentChatState = atom<CurrentChat>({
  key: "currentChatState",
  default: {
    _id: "",
    userId: "",
    userName: "",
  },
});

export const currentChatMessageListState = atom<Array<BaseMessage>>({
  key: "currentChatMessageListState",
  default: [],
});
