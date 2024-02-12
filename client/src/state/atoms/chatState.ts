import { atom } from "recoil";
import { BaseChat } from "../../types/chats";

export const chatListState = atom<Array<BaseChat>>({
  key: "chatState",
  default: [],
});
