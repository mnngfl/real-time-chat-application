import { Box, Divider, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useRecoilStateLoadable, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  chatListState,
  currentChatIdSelector,
  currentChatMessageListState,
  currentChatState,
  onlineUserListState,
  socketState,
  userState,
} from "@/state";
import type { OnlineUser } from "@/types/users";
import type { PreviewChat } from "@/types/chats";
import { ChatProfile, ChatList, ChatRoom } from "@/components/chat";
import SearchChat from "@/components/chat/SearchChat";
import ToggleTheme from "@/components/common/ToggleTheme";

const Chat = () => {
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);
  const currentChatId = useRecoilValue(currentChatIdSelector);
  const resetCurrentChat = useResetRecoilState(currentChatState);
  const [chatList, setChatList] = useRecoilStateLoadable(chatListState);
  const resetChatList = useResetRecoilState(chatListState);
  const setOnlineUserList = useSetRecoilState(onlineUserListState);
  const setCurrentChatMessageList = useSetRecoilState(currentChatMessageListState);
  const [showNewButton, setShowNewButton] = useState(false);
  const isLoaded = useMemo(() => chatList?.state === "hasValue", [chatList?.state]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("addNewUser", user._id);

    return () => {
      resetChatList();
      setCurrentChatMessageList([]);
      resetCurrentChat();
    };
  }, [resetCurrentChat, resetChatList, setCurrentChatMessageList, socket, user?._id]);

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
      if (message.chatId !== currentChatId || !isLoaded) return;

      const updateChatIndex = chatList.contents.findIndex((chat: PreviewChat) => {
        return chat.chatId === message.chatId;
      });
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
  }, [chatList, currentChatId, isLoaded, setChatList, setCurrentChatMessageList, socket, user?._id]);

  return (
    <Flex w="100%">
      <Box w={{ base: "8em", lg: "25em" }} bg="on-secondary">
        <ChatProfile />
        <Divider borderColor="outline" />
        <SearchChat />
        {isLoaded &&
          (chatList.contents.length > 0 ? (
            <ChatList chatList={chatList.contents} />
          ) : (
            <Flex h={"calc(100vh - 21%)"} alignItems={"center"} justifyContent={"center"}>
              No chats started
            </Flex>
          ))}
        {!isLoaded && (
          <Flex paddingX={12} paddingY={6} alignItems={"center"} justifyContent={"space-between"}>
            <SkeletonCircle size="12" />
            <SkeletonText noOfLines={2} spacing={4} skeletonHeight={"2"} width={"80%"} />
          </Flex>
        )}
      </Box>
      <Box w={{ base: "calc(100% - 8em)", lg: "calc(100% - 25em)" }} bg="on-secondary" p={12}>
        <ToggleTheme />
        <ChatRoom showNewButton={showNewButton} setShowNewButton={setShowNewButton} />
      </Box>
    </Flex>
  );
};

export default Chat;
