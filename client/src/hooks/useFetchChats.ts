import { useCallback, useState } from "react";
import { searchUserChats } from "../services/chats";
import { useSetRecoilState } from "recoil";
import { chatListState } from "../state";
import useErrorToast from "./useErrorToast";

const useFetchChats = () => {
  const setChatList = useSetRecoilState(chatListState);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  useErrorToast(errorMessage);

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
        setErrorMessage(error);
      }
    },
    [setChatList]
  );

  return { fetchChats };
};

export default useFetchChats;
