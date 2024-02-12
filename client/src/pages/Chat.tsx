import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import ChatList from "../components/chat/ChatList";
import ChatRoom from "../components/chat/ChatRoom";
import { useCallback, useEffect, useState } from "react";
import { findUserChats } from "../services/chats";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdSelector } from "../state";
import { chatListState } from "../state/atoms/chatState";

const Chat = () => {
  const userId = useRecoilValue(userIdSelector);
  const [chats, setChats] = useRecoilState(chatListState);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const res = await findUserChats(userId);
    setChats(res);
    setIsLoading(false);
  }, [setChats, userId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <Flex w="100%">
      <Box w="35%" bg="gray.800" color={"white"}>
        <Box p={12}>
          <Text fontSize={"2xl"} mb={6}>
            Messages
          </Text>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"}>
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>
        </Box>
        <Divider borderColor="gray.600" />
        {isLoading && <Spinner />}
        {chats?.length > 0 && <ChatList chats={chats} />}
      </Box>
      <Box w="65%" bg="gray.900" p={12} color={"white"}>
        <ChatRoom />
      </Box>
    </Flex>
  );
};

export default Chat;
