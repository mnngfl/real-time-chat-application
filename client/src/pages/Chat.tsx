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
import { chatListState } from "../state/atoms/chatState";
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

  const fetchChats = useCallback(async () => {
    if (!userId) return;
    const res = await findUserChats();
    setChatList(res);
  }, [setChatList, userId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("addNewUser", userId);
    socket.on("getOnlineUsers", (res: Array<OnlineUser>) => {
      setOnlineUserList(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [setOnlineUserList, socket, userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getNotification", (notification) => {
      if (notification.receiveUser._id !== userId) return;
      if (notification.chatId === currentChatId) return;

      const updateChatIndex = chatList.findIndex((chat) => {
        return chat.chatId === notification.chatId;
      });
      setChatList((prevList) => {
        return prevList.map((prevChat, index) => {
          if (index === updateChatIndex) {
            return {
              ...prevChat,
              latestMessage: notification.latestMessage,
              latestMessageAt: notification.latestMessageAt,
              unreadCount: prevChat.unreadCount + 1,
            };
          } else {
            return prevChat;
          }
        });
      });
    });

    return () => {
      socket.off("getNotification");
    };
  }, [chatList, currentChatId, setChatList, socket, userId]);

  useEffect(() => {
    if (!currentChatId) return;

    setChatList((prevList) => {
      return prevList.map((prevChat) => {
        if (prevChat.chatId === currentChatId) {
          return {
            ...prevChat,
            unreadCount: 0,
          };
        } else {
          return prevChat;
        }
      });
    });
  }, [currentChatId, setChatList]);

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
