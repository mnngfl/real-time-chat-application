import { selector } from "recoil";
import { CurrentChat } from "../../types/chats";
import { currentChatState } from "../atoms/chatState";

export const currentChatIdSelector = selector({
  key: "currentChatIdSelector",
  get: ({ get }) => {
    const currentChat: CurrentChat = get(currentChatState);
    return currentChat ? currentChat._id : "";
  },
});
