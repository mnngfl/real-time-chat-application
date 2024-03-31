import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { BaseMessage } from "../../types/chats";
import { useRecoilValue } from "recoil";
import { userIdSelector } from "../../state";
import { format } from "date-fns";
import UserAvatar from "../common/UserAvatar";
import type { FC } from "react";

export type ChatBubbleProps = {
  message: BaseMessage;
  otherUser: {
    nickname?: string;
    avatar?: string;
  };
};

const ChatBubble: FC<ChatBubbleProps> = ({ message, otherUser }) => {
  const parser = new DOMParser();
  const parsedHTML = parser.parseFromString(message.text, "text/html");
  const textContent = parsedHTML.body.textContent;

  const userId = useRecoilValue(userIdSelector);

  const isMyMessage = message.sendUser._id === userId;

  return (
    <Flex
      className="chat-bubble"
      flexDir={"row"}
      justifyContent={isMyMessage ? "flex-end" : "flex-start"}
    >
      {isMyMessage ? (
        <HStack mr={3} ml={"35%"} mb={3} alignItems={"flex-end"}>
          <Text fontSize={"small"} textAlign={"right"}>
            {format(message.createdAt, "HH:mm aa")}
          </Text>
          <Box
            flex={1}
            w="auto"
            p={2}
            bgColor={"gray.700"}
            borderRadius={8}
            borderTopRightRadius={0}
            whiteSpace={"pre-wrap"}
          >
            {textContent}
          </Box>
        </HStack>
      ) : (
        <>
          <UserAvatar avatar={otherUser.avatar} size={"xs"} />
          <Box ml={3} mr={"35%"} mb={3}>
            <Text fontWeight={600}>{otherUser.nickname || "Anonymous"}</Text>
            <HStack mb={3} alignItems={"flex-end"}>
              <Box
                w="auto"
                p={2}
                bgColor={"gray.700"}
                borderRadius={8}
                borderTopLeftRadius={0}
                whiteSpace={"pre-wrap"}
              >
                {textContent}
              </Box>
              <Text fontSize={"small"} whiteSpace={"nowrap"}>
                {format(message.createdAt, "HH:mm aa")}
              </Text>
            </HStack>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default ChatBubble;
