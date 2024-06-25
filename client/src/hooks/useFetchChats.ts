import { useCallback } from "react";
import { searchUserChats } from "../services/chats";
import { useSetRecoilState } from "recoil";
import { chatListState } from "../state";

const useFetchChats = () => {
  const setChatList = useSetRecoilState(chatListState);

  const fetchChats = useCallback(
    async (search?: string) => {
      if (!setChatList) return;

      try {
        const { data: res } = await searchUserChats(search);
        if (res) {
          setChatList(res);
        }
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    [setChatList]
  );

  return { fetchChats };
};

export default useFetchChats;
