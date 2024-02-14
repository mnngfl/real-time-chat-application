import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { BaseUser } from "../../types/users";
import { PreviewChat } from "../../types/chats";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdSelector } from "../../state";
import { useEffect, useState } from "react";
import { currentChatState } from "../../state/atoms/chatState";

const ChatPreview = ({ chat }: { chat: PreviewChat }) => {
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const userId = useRecoilValue(userIdSelector);
  const [chatUser, setChatUser] = useState<BaseUser>({
    _id: "",
    userName: "",
  });

  useEffect(() => {
    const recipient = chat?.joinedUsers.find((id) => id._id !== userId);
    if (recipient) setChatUser(recipient);
  }, [chat?.joinedUsers, userId]);

  return (
    <Flex
      color={"white"}
      paddingX={12}
      paddingY={6}
      alignItems={"center"}
      bgColor={currentChat._id === chat.chatId ? "gray.700" : "gray.800"}
      _hover={{ bgColor: "gray.600", cursor: "pointer" }}
      onClick={() =>
        setCurrentChat({ _id: chat.chatId, userName: chatUser.userName })
      }
    >
      <Avatar src="#" />
      <Flex justifyContent={"space-between"} w={"100%"}>
        <VStack alignItems={"start"} ml={4}>
          <Text fontWeight={"bold"}>{chatUser.userName}</Text>
          <Text fontSize={"small"} lineHeight="tight" noOfLines={1}>
            {chat.latestMessage}
          </Text>
        </VStack>
        <VStack alignItems={"end"} ml={4}>
          <Text fontSize={"small"} whiteSpace={"nowrap"}>
            {chat.updatedAt}
          </Text>
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
                12
              </text>
            </svg>
          </Icon>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ChatPreview;
