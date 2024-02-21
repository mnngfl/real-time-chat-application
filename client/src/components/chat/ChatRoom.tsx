import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Circle,
  Divider,
  Flex,
  Icon,
  Spinner,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findMessages } from "../../services/chats";
import { ArrowUpIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import ChatBox from "./ChatBox";
import { onlineUserListState } from "../../state";

const ChatRoom = () => {
  const currentChat = useRecoilValue(currentChatState);
  const [currentChatMessageList, setCurrentChatMessageList] = useRecoilState(
    currentChatMessageListState
  );
  const onlineUserList = useRecoilValue(onlineUserListState);
  const boxRef = useRef<HTMLDivElement>(null);
  const [currPage, setCurrPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const isOnlineUser = useMemo(() => {
    return onlineUserList.some((user) => user.userId === currentChat.userId);
  }, [currentChat.userId, onlineUserList]);

  const getMessages = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const res = await findMessages(currentChat._id, page);
        if (res) {
          setCurrentChatMessageList((prev) => {
            return [...res.data, ...prev];
          });
          setHasNextPage(res.pageInfo.hasMorePages);
          setViewCount(res.data.length);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentChat._id, setCurrentChatMessageList]
  );

  const getNextPage = async () => {
    if (isLoading) return;
    setCurrPage(currPage + 1);
    await getMessages(currPage + 1);
  };

  useEffect(() => {
    if (!currentChat._id) return;
    setViewCount(0);
    setCurrPage(1);
    setHasNextPage(false);
    setCurrentChatMessageList([]);
    getMessages();
  }, [currentChat._id, getMessages, setCurrentChatMessageList]);

  useEffect(() => {
    if (boxRef.current && viewCount > 0) {
      const elements = boxRef.current
        .querySelectorAll("[name='chat-bubble']")
        .values();
      const offsetHeight = Array.from(elements)
        .slice(0, viewCount)
        .reduce((acc, curr) => {
          return (acc += curr.clientHeight);
        }, 0);
      boxRef.current.scrollTop = offsetHeight;
    }
  }, [viewCount, currentChatMessageList]);

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
        {hasNextPage && (
          <Circle
            size="2.5rem"
            bg="gray.500"
            color="white"
            mb={4}
            marginX={"auto"}
            _hover={{ cursor: "pointer" }}
            onClick={() => getNextPage()}
          >
            {isLoading ? <Spinner size={"sm"} /> : <ArrowUpIcon />}
          </Circle>
        )}
        {/* <ChatBubble />
        <DividerWithDate date={"Today"} bgColor={"gray.700"} />
        <ChatBubble /> */}
        {currentChatMessageList.map((message) => {
          return (
            <ChatBubble
              key={message._id || message.chatId + message.createdAt}
              message={message}
            />
          );
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
