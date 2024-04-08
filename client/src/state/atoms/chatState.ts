import { atom, selector } from "recoil";
import { BaseMessage, CurrentChat, PreviewChat } from "@/types/chats";
import { searchUserChats } from "@/services/chats";

export const chatListState = atom<Array<PreviewChat>>({
  key: "chatState",
  default: selector({
    key: "chatState/Default",
    get: async () => {
      const res = await searchUserChats();
      return res;
    },
  }),
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
