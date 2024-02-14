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
import { userIdSelector } from "../state";
import { chatListState } from "../state/atoms/chatState";
import PotentialChat from "../components/chat/PotentialChat";

const Chat = () => {
  const userId = useRecoilValue(userIdSelector);
  const [chats, setChats] = useRecoilState(chatListState);

  const fetchChats = useCallback(async () => {
    if (!userId) return;
    const res = await findUserChats();
    setChats(res);
  }, [setChats, userId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

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
        {chats?.length > 0 && <ChatList chats={chats} />}
      </Box>
      <Box w="65%" bg="gray.900" p={12} color={"white"}>
        <ChatRoom />
      </Box>
    </Flex>
  );
};

export default Chat;
