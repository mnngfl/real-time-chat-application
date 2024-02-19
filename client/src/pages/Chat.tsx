import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import ChatList from "../components/chat/ChatList";
import ChatRoom from "../components/chat/ChatRoom";
import { useCallback, useEffect } from "react";
import { findUserChats } from "../services/chats";
import { useRecoilState, useRecoilValue } from "recoil";
import { onlineUserListState, userIdSelector } from "../state";
import {
  chatListState,
  currentChatMessageListState,
} from "../state/atoms/chatState";
import PotentialChat from "../components/chat/PotentialChat";
import { OnlineUser } from "../types/users";
import { useSocket } from "../context/SocketProvider";
import { currentChatIdSelector } from "../state/selectors/chatSelectors";

const Chat = () => {
  const socket = useSocket();
  const userId = useRecoilValue(userIdSelector);
  const currentChatId = useRecoilValue(currentChatIdSelector);
  const [chatList, setChatList] = useRecoilState(chatListState);
  const [, setOnlineUserList] = useRecoilState(onlineUserListState);
  const [, setCurrentChatMessageList] = useRecoilState(
    currentChatMessageListState
  );

  const fetchChats = useCallback(async () => {
    if (!socket) return;

    try {
      const res = await findUserChats();
      setChatList(res);

      const rooms = res.map((v) => v.chatId);
      socket.emit("enterRoom", rooms);
    } catch (error) {
      console.log(error);
    }
  }, [setChatList, socket]);

  useEffect(() => {
    fetchChats();
  }, [currentChatId, fetchChats]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("addNewUser", userId);
  }, [socket, userId]);

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

    socket.on("getNotification", () => {
      fetchChats();
    });

    return () => {
      socket.off("getNotification");
    };
  }, [fetchChats, socket]);

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
    });

    return () => {
      socket.off("getMessage");
    };
  }, [chatList, currentChatId, setChatList, setCurrentChatMessageList, socket]);

  return (
    <Flex w="90%">
      <Box w="35%" bg="gray.800" color={"white"}>
        <Box p={12}>
          <Text fontSize={"2xl"} mb={6}>
            Messages
          </Text>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"}>
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <InputRightElement>
              <CloseIcon color="gray.300" />
            </InputRightElement>
            <Input placeholder="Search" />
          </InputGroup>
        </Box>
        <Divider borderColor="gray.600" />
        <PotentialChat fetchChats={fetchChats} />
        <Divider borderColor="gray.600" />
        {chatList?.length > 0 && <ChatList chatList={chatList} />}
      </Box>
      <Box w="65%" bg="gray.900" p={12} color={"white"}>
        <ChatRoom />
      </Box>
    </Flex>
  );
};

export default Chat;
