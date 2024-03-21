import {
  Box,
  Divider,
  Flex,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import ChatList from "../components/chat/ChatList";
import ChatRoom from "../components/chat/ChatRoom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useRecoilStateLoadable,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  chatListState,
  currentChatIdSelector,
  currentChatMessageListState,
  currentChatState,
  onlineUserListState,
  socketState,
  userState,
} from "../state";
import { OnlineUser } from "../types/users";
import useFetchChats from "../hooks/useFetchChats";
import { PreviewChat } from "../types/chats";
import ChatProfile from "../components/chat/ChatProfile";

const Chat = () => {
  const { fetchChats } = useFetchChats();
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);
  const currentChatId = useRecoilValue(currentChatIdSelector);
  const resetCurrentChat = useResetRecoilState(currentChatState);
  const [chatList, setChatList] = useRecoilStateLoadable(chatListState);
  const setOnlineUserList = useSetRecoilState(onlineUserListState);
  const setCurrentChatMessageList = useSetRecoilState(
    currentChatMessageListState
  );
  const [showNewButton, setShowNewButton] = useState(false);
  const isLoaded = useMemo(
    () => chatList.state === "hasValue",
    [chatList.state]
  );

  const handleFetchChats = useCallback(async () => {
    if (!socket || !fetchChats) return;

    try {
      const res = await fetchChats();
      if (res) {
        const rooms = res.map((v) => v.chatId);
        socket.emit("enterRoom", rooms);
      }
    } catch (error) {
      console.log(error);
    }
  }, [fetchChats, socket]);

  useEffect(() => {
    handleFetchChats();
  }, [handleFetchChats]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("addNewUser", user._id);

    return () => {
      setChatList([]);
      setCurrentChatMessageList([]);
      resetCurrentChat();
    };
  }, [
    resetCurrentChat,
    setChatList,
    setCurrentChatMessageList,
    socket,
    user?._id,
  ]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getOnlineUsers", (res: Array<OnlineUser>) => {
      setOnlineUserList(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [setOnlineUserList, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (message) => {
      if (message.chatId !== currentChatId) return;

      const updateChatIndex = chatList.contents.findIndex(
        (chat: PreviewChat) => {
          return chat.chatId === message.chatId;
        }
      );
      setChatList((prevList) => {
        return prevList.map((prevChat, index) => {
          if (index === updateChatIndex) {
            return {
              ...prevChat,
              latestMessage: message.text,
              latestMessageAt: message.createdAt,
            };
          } else {
            return prevChat;
          }
        });
      });

      setCurrentChatMessageList((prev) => [...prev, message]);

      if (message.receiveUser._id === user?._id) {
        setShowNewButton(true);
      }

      socket.off("getNotification");
    });

    return () => {
      socket.off("getMessage");
    };
  }, [
    chatList,
    currentChatId,
    setChatList,
    setCurrentChatMessageList,
    socket,
    user?._id,
  ]);

  return (
    <Flex w="100%">
      <Box w="25%" bg="gray.800" color={"white"}>
        <ChatProfile />
        <Divider borderColor="gray.600" />
        {isLoaded &&
          (chatList?.contents.length > 0 ? (
            <ChatList chatList={chatList.contents} />
          ) : (
            <Flex
              h={"calc(100vh - 12.5%)"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              No chats started
            </Flex>
          ))}
        {!isLoaded && (
          <Flex
            paddingX={12}
            paddingY={6}
            alignItems={"center"}
            justifyContent={"space-between"}
            bgColor={"gray.800"}
          >
            <SkeletonCircle size="12" />
            <SkeletonText
              noOfLines={2}
              spacing={4}
              skeletonHeight={"2"}
              width={"80%"}
            />
          </Flex>
        )}
      </Box>
      <Box w="75%" bg="gray.900" p={12} color={"white"}>
        <ChatRoom
          showNewButton={showNewButton}
          setShowNewButton={setShowNewButton}
        />
      </Box>
    </Flex>
  );
};

export default Chat;
