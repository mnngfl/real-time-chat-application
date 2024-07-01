import { atom, selector } from "recoil";
import { BaseMessage, CurrentChat, PreviewChat } from "@/types/chats";
import { searchUserChats } from "@/services/chats";
import { socketState } from "./socketState";

export const chatListState = atom<Array<PreviewChat>>({
  key: "chatState",
  default: selector({
    key: "chatState/Default",
    get: async () => {
      const { data: res } = await searchUserChats();
      return res;
    },
  }),
  effects: [
    ({ onSet, getPromise }) => {
      getPromise(socketState).then((socket) => {
        if (!socket) return;
        onSet((newValue, _, isReset) => {
          if (isReset) {
            return;
          }
          const rooms = newValue.map((v) => v.chatId);
          socket.emit("enterRoom", rooms);
        });
      });
    },
  ],
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
