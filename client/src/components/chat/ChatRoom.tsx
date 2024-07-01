import { AvatarBadge, Box, Button, Center, Circle, Divider, Flex, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { ChatBubble, DividerWithDate, ChatBox } from "@/components/chat";
import { useRecoilState, useRecoilValue } from "recoil";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FC } from "react";
import { findMessages } from "@/services/chats";
import { ArrowUpIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  currentChatMessageListState,
  currentChatState,
  onlineUserListState,
  socketState,
  userIdSelector,
} from "@/state";
import { parseISO, isSameDay } from "date-fns";
import throttle from "lodash/throttle";
import { useFetchChats } from "@/hooks";
import { UserAvatar } from "@/components/common";
import type { BaseMessage } from "@/types/chats";
import useErrorToast from "@/hooks/useErrorToast";

export type ChatRoomProps = {
  showNewButton: boolean;
  setShowNewButton: (newState: boolean) => void;
};

const ChatRoom: FC<ChatRoomProps> = ({ showNewButton, setShowNewButton }) => {
  const { fetchChats } = useFetchChats();
  const [socket] = useRecoilState(socketState);
  const userId = useRecoilValue(userIdSelector);
  const currentChat = useRecoilValue(currentChatState);
  const [messageList, setMessageList] = useRecoilState(currentChatMessageListState);
  const onlineUserList = useRecoilValue(onlineUserListState);
  const boxRef = useRef<HTMLDivElement>(null);
  const [currPage, setCurrPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [isScrollCreated, setScrollCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  useErrorToast(errorMessage);

  const isOnlineUser = useMemo(() => {
    return onlineUserList.some((user) => user.userId === currentChat.userId);
  }, [currentChat.userId, onlineUserList]);

  const getMessages = useCallback(
    async (page = 1) => {
      if (!currentChat._id) return;
      setIsLoading(true);
      setViewCount(0);

      try {
        const res = await findMessages(currentChat._id, page);
        const { data: messages, pagination } = res;

        setViewCount(messages.length);
        setHasNextPage(pagination!.hasMorePages);
        setMessageList((prev) => {
          const newMessages = messages.filter((v: BaseMessage) => !prev.some((message) => message._id === v._id));
          return [...newMessages, ...prev];
        });
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentChat._id, setMessageList]
  );

  const getMessagesNewOnly = useCallback(async () => {
    if (!currentChat._id) return;

    try {
      const res = await findMessages(currentChat._id);
      const messages = res.data;
      setMessageList((prev) => {
        const newMessages = messages.filter((v: BaseMessage) => !prev.some((message) => message._id === v._id));
        return [...prev, ...newMessages];
      });
      setShowNewButton(true);
    } catch (error) {
      setErrorMessage(error);
    }
  }, [currentChat._id, setMessageList, setShowNewButton]);

  const getNextPage = async () => {
    if (isLoading) return;
    setCurrPage(currPage + 1);
    await getMessages(currPage + 1);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("getNotification", (noti) => {
      if (noti.receiverId === userId) {
        fetchChats();
        if (noti.chatId === currentChat._id) {
          getMessagesNewOnly();
        }
      }
    });

    return () => {
      socket.off("getNotification");
    };
  }, [currentChat._id, fetchChats, getMessagesNewOnly, socket, userId]);

  useEffect(() => {
    if (!currentChat._id) return;
    setIsLoading(null);
    setMessageList([]);
  }, [currentChat._id, setMessageList]);

  useEffect(() => {
    // fetch messages whenever chatId is changed
    if (!currentChat._id || isLoading !== null) return;
    setCurrPage(1);
    setViewCount(0);
    setHasNextPage(false);

    getMessages();
  }, [getMessages, currentChat._id, isLoading]);

  const handleScroll = throttle(() => {
    const boxEl = boxRef.current;

    if (boxEl && showNewButton && Math.round(boxEl.scrollTop) >= Math.round(boxEl.scrollHeight - boxEl.offsetHeight)) {
      setShowNewButton(false);
    }
  }, 300);

  useEffect(() => {
    const boxEl = boxRef.current;
    if (!boxEl) return;

    boxEl?.addEventListener("scroll", handleScroll);

    return () => {
      boxEl?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const boxEl = boxRef.current;

    if (boxEl && showNewButton) {
      if (boxEl.scrollHeight > boxEl.clientHeight) {
        setScrollCreated(true);
      } else {
        setScrollCreated(false);
      }
    }
  }, [showNewButton, messageList]);

  useLayoutEffect(() => {
    if (boxRef.current && viewCount > 0) {
      const elements = [...boxRef.current.querySelectorAll(".chat-bubble")];
      let offsetHeight = 0;

      for (const el of elements.slice(0, viewCount)) {
        offsetHeight += el.clientHeight;
      }

      boxRef.current.scrollTop = offsetHeight;
    }
  }, [viewCount]);

  const showNewMessage = () => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
      setShowNewButton(false);
    }
  };

  const renderDivider = (currDate: Date, prevDate: Date | null) => {
    if (prevDate === null || !isSameDay(currDate, prevDate)) {
      return <DividerWithDate date={currDate} bgColor="on-secondary"></DividerWithDate>;
    }
  };

  return currentChat._id ? (
    <>
      <Flex mb={4}>
        <Center>
          <UserAvatar avatar={currentChat.avatar}>
            {isOnlineUser && <AvatarBadge bg="green.400" boxSize="1.25em" />}
          </UserAvatar>
          <Box ml={4}>
            <Text fontWeight={"semibold"} fontSize={"xl"}>
              {currentChat.nickname || "Anonymous"}
            </Text>
            <Text fontSize={"small"}>({currentChat.userName})</Text>
          </Box>
        </Center>
      </Flex>
      <Divider />
      <Box h={"85%"} overflowY={"auto"} paddingY={4} bgColor="on-secondary" ref={boxRef}>
        {hasNextPage && (
          <Circle
            size="2.5rem"
            bg="primary-container"
            color="on-primary-container"
            mb={4}
            marginX={"auto"}
            _hover={{ cursor: "pointer" }}
            onClick={() => getNextPage()}
          >
            {isLoading ? <Spinner size={"sm"} /> : <ArrowUpIcon />}
          </Circle>
        )}
        {messageList.map((message, index, arr) => {
          const currDate = parseISO(message.createdAt);
          const prevDate = index > 0 ? parseISO(arr[index - 1].createdAt) : null;

          return (
            <Fragment key={message._id || message.chatId + message.createdAt}>
              {renderDivider(currDate, prevDate)}
              <ChatBubble
                message={message}
                otherUser={{
                  nickname: currentChat?.nickname,
                  avatar: currentChat?.avatar,
                }}
              />
            </Fragment>
          );
        })}
        {isScrollCreated && showNewButton && (
          <Center position="absolute" bottom={"15%"} width={"50%"}>
            <Button
              bgColor="primary-container"
              color="on-primary-container"
              size={"sm"}
              _hover={{ cursor: "pointer" }}
              onClick={() => showNewMessage()}
            >
              ↓ New Message
            </Button>
          </Center>
        )}
      </Box>
      <Divider />
      <ChatBox boxRef={boxRef} />
    </>
  ) : (
    <Flex h={"100%"} alignItems={"center"} justifyContent={"center"}>
      <VStack color={"on-primary-container"}>
        <Icon boxSize={8}>
          <InfoOutlineIcon />
        </Icon>
        <Text fontSize={"larger"}>Click user to start chat</Text>
      </VStack>
    </Flex>
  );
};

export default ChatRoom;
