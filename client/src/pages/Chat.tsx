import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import ChatList from "../components/chat/ChatList";
import ChatRoom from "../components/chat/ChatRoom";
import { useCallback, useEffect, useState } from "react";
import { findUserChats } from "../services/chats";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatListState,
  currentChatIdSelector,
  currentChatMessageListState,
  onlineUserListState,
  socketState,
  userState,
} from "../state";
import PotentialChat from "../components/chat/PotentialChat";
import { OnlineUser } from "../types/users";

const Chat = () => {
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);
  const currentChatId = useRecoilValue(currentChatIdSelector);
  const [chatList, setChatList] = useRecoilState(chatListState);
  const setOnlineUserList = useSetRecoilState(onlineUserListState);
  const setCurrentChatMessageList = useSetRecoilState(
    currentChatMessageListState
  );
  const [showNewButton, setShowNewButton] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!socket) return;

    try {
      const res = await findUserChats();
      setChatList(res);

      const rooms = res?.map((v) => v.chatId);
      socket.emit("enterRoom", rooms);
    } catch (error) {
      console.log(error);
    }
  }, [setChatList, socket]);

  useEffect(() => {
    fetchChats();
  }, [currentChatId, fetchChats]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("addNewUser", user._id);
  }, [socket, user?._id]);

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

      const updateChatIndex = chatList.findIndex((chat) => {
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
  }, [
    chatList,
    currentChatId,
    setChatList,
    setCurrentChatMessageList,
    socket,
    user?._id,
  ]);

  return (
    <Flex w="90%">
      <Box w="35%" bg="gray.800" color={"white"}>
        <Box p={12}>
          <Text fontSize={"2xl"}>Hello, {user?.userName} 😺</Text>
        </Box>
        <Divider borderColor="gray.600" />
        <PotentialChat fetchChats={fetchChats} />
        <Divider borderColor="gray.600" />
        {chatList?.length > 0 && <ChatList chatList={chatList} />}
      </Box>
      <Box w="65%" bg="gray.900" p={12} color={"white"}>
        <ChatRoom
          showNewButton={showNewButton}
          setShowNewButton={setShowNewButton}
          fetchChats={fetchChats}
        />
      </Box>
    </Flex>
  );
};

export default Chat;
