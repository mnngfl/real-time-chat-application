import {
  AvatarBadge,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BaseUser } from "../../types/users";
import { PreviewChat } from "../../types/chats";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentChatState,
  onlineUserListState,
  socketState,
  userIdSelector,
} from "../../state";
import { useEffect, useMemo, useState } from "react";
import { deleteNotifications } from "../../services/chats";
import { format } from "date-fns";
import useFetchChats from "../../hooks/useFetchChats";
import UserAvatar from "../common/UserAvatar";
import useResponsive from "@/hooks/useResponsive";

const ChatPreview = ({ chat }: { chat: PreviewChat }) => {
  const { isPc } = useResponsive();
  const { fetchChats } = useFetchChats();
  const socket = useRecoilValue(socketState);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const userId = useRecoilValue(userIdSelector);
  const onlineUserList = useRecoilValue(onlineUserListState);
  const [chatUser, setChatUser] = useState<BaseUser>({
    _id: "",
    userName: "",
    nickname: "",
    avatar: "",
  });

  const isOnlineUser = useMemo(() => {
    return onlineUserList.some((user) => user.userId === chatUser._id);
  }, [chatUser._id, onlineUserList]);

  useEffect(() => {
    if (!userId || !chat?.joinedUsers) return;
    const recipient = chat.joinedUsers.find((id) => id._id !== userId);
    if (recipient) setChatUser(recipient);
  }, [chat?.joinedUsers, userId]);

  const unreadCount = useMemo(() => {
    return chat.notifications.find((noti) => noti._id[1] === userId)
      ?.unreadCount;
  }, [chat.notifications, userId]);

  const onChangeChat = async (chatId: string) => {
    if (currentChat._id === chatId) return;

    setCurrentChat({
      _id: chat.chatId,
      userId: chatUser._id,
      userName: chatUser.userName,
      nickname: chatUser?.nickname,
      avatar: chatUser?.avatar,
    });

    if (!socket) return;
    socket.emit("changeRoom", chat.chatId);

    if (!unreadCount) return;
    await deleteNotifications(chat.chatId);
    await fetchChats();
  };

  return (
    <Flex
      color={"white"}
      paddingX={8}
      paddingY={4}
      alignItems={"center"}
      bgColor={currentChat._id === chat.chatId ? "gray.700" : "gray.800"}
      _hover={{ bgColor: "gray.600", cursor: "pointer" }}
      onClick={() => onChangeChat(chat.chatId)}
    >
      <HStack>
        <UserAvatar avatar={chatUser.avatar}>
          {isOnlineUser && <AvatarBadge bg="green.500" boxSize="1.25em" />}
        </UserAvatar>
      </HStack>
      {isPc && (
        <Flex justifyContent={"space-between"} w={"100%"}>
          <Flex alignItems={"start"} ml={6} flexDirection={"column"}>
            <Text fontWeight={"bold"} noOfLines={1} wordBreak={"break-all"}>
              {chatUser.nickname || "Anonymous"}
            </Text>
            <Text fontSize={"small"} mb={1}>
              ({chatUser.userName})
            </Text>
            {chat.latestMessage?.length > 0 ? (
              <Text fontSize={"small"} lineHeight="tight" noOfLines={1}>
                {chat.latestMessage}
              </Text>
            ) : (
              <Text
                fontSize={"small"}
                color={"gray.400"}
                fontStyle={"italic"}
                lineHeight="tight"
                noOfLines={1}
              >
                There are no messages yet.
              </Text>
            )}
          </Flex>
          <VStack alignItems={"end"} ml={4}>
            <Text fontSize={"small"} whiteSpace={"nowrap"}>
              {chat.latestMessageAt &&
                format(chat.latestMessageAt, "yy-MM-dd HH:mm")}
            </Text>
            {unreadCount && (
              <Icon viewBox="0 0 200 200" boxSize={8} color="red.500">
                <svg>
                  <path
                    fill="currentColor"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                  />
                  <text
                    x="50%"
                    y="51%"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    fontSize={80}
                    fontWeight={600}
                  >
                    {unreadCount}
                  </text>
                </svg>
              </Icon>
            )}
          </VStack>
        </Flex>
      )}
    </Flex>
  );
};

export default ChatPreview;
