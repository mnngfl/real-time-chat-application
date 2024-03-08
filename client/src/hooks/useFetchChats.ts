import { useCallback } from "react";
import { findUserChats } from "../services/chats";
import { useSetRecoilState } from "recoil";
import { chatListState } from "../state";

const useFetchChats = () => {
  const setChatList = useSetRecoilState(chatListState);

  const fetchChats = useCallback(async () => {
    if (!setChatList) return;

    try {
      const res = await findUserChats();
      if (res) {
        setChatList(res);
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  }, [setChatList]);

  return { fetchChats };
};

export default useFetchChats;
