import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Divider,
  Flex,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import DividerWithDate from "./DividerWithDate";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentChatState,
  currentChatMessageListState,
} from "../../state/atoms/chatState";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { findMessages } from "../../services/chats";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import ChatBox from "./ChatBox";
import { onlineUserListState } from "../../state";

const ChatRoom = () => {
  const currentChat = useRecoilValue(currentChatState);
  const [currentChatMessageList, setCurrentChatMessageList] = useRecoilState(
    currentChatMessageListState
  );
  const onlineUserList = useRecoilValue(onlineUserListState);
  const boxRef = useRef<HTMLDivElement>(null);

  const isOnlineUser = useMemo(() => {
    return onlineUserList.some((user) => user.userId === currentChat.userId);
  }, [currentChat.userId, onlineUserList]);

  const getMessages = useCallback(async () => {
    const res = await findMessages(currentChat._id);
    if (res) setCurrentChatMessageList(res);
  }, [currentChat, setCurrentChatMessageList]);

  useEffect(() => {
    if (!currentChat._id) return;
    getMessages();
  }, [currentChat, getMessages]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [currentChatMessageList]);

  // const renderDivider = (currDate, prevDate) => {
  //   if (!prevDate) return null;

  //   const currDateStr = currDate.toLocaleDateString();
  //   const prevDateStr = prevDate.toLocaleDateString();

  //   if (currDateStr !== prevDateStr) {
  //     return (
  //       <DividerWithDate
  //         date={currDateStr}
  //         bgColor={"gray.700"}
  //       ></DividerWithDate>
  //     );
  //   }
  // };

  return currentChat._id ? (
    <>
      <Flex mb={4}>
        <Center>
          <Avatar mr={4}>
            {isOnlineUser && <AvatarBadge bg="green.500" boxSize="1.25em" />}
          </Avatar>
          <Text fontSize={"xl"}>{currentChat.userName}</Text>
        </Center>
      </Flex>
      <Divider />
      <Box
        h={"85%"}
        overflowY={"auto"}
        paddingY={4}
        bgColor={"gray.700"}
        ref={boxRef}
      >
        {/* <ChatBubble />
        <DividerWithDate date={"Today"} bgColor={"gray.700"} />
        <ChatBubble /> */}
        {currentChatMessageList.map((message, index) => {
          return <ChatBubble key={message._id || index} message={message} />;
        })}
      </Box>
      <Divider />
      <ChatBox />
    </>
  ) : (
    <Flex h={"100%"} alignItems={"center"} justifyContent={"center"}>
      <VStack color={"white"}>
        <Icon boxSize={8}>
          <InfoOutlineIcon />
        </Icon>
        <Text fontSize={"larger"}>Click user to start chat</Text>
      </VStack>
    </Flex>
  );
};

export default ChatRoom;
