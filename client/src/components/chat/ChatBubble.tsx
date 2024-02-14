import { Avatar, Box, Flex, HStack, Text } from "@chakra-ui/react";
import { BaseMessage } from "../../types/chats";
import { useRecoilValue } from "recoil";
import { userIdSelector } from "../../state";

const ChatBubble = ({ message }: { message: BaseMessage }) => {
  const userId = useRecoilValue(userIdSelector);

  const isMyMessage = message.sendUser._id === userId;

  return (
    <Flex
      flexDir={"row"}
      justifyContent={isMyMessage ? "flex-end" : "flex-start"}
    >
      {isMyMessage ? (
        <>
          <HStack mr={3} ml={"25%"}>
            <Text fontSize={"small"} textAlign={"right"}>
              {message.createdAt}
            </Text>
            <Box
              w="auto"
              p={2}
              mb={3}
              bgColor={"gray.300"}
              borderRadius={8}
              borderTopRightRadius={0}
              display={"inline-block"}
            >
              {message.text}
            </Box>
          </HStack>
        </>
      ) : (
        <>
          <Avatar size={"xs"} />
          <Box ml={3} mr={"25%"}>
            <Text fontWeight={600}>{message.sendUser.userName}</Text>
            <HStack mb={2}>
              <Box
                w="auto"
                p={2}
                mb={3}
                bgColor={"gray.300"}
                borderRadius={8}
                borderTopLeftRadius={0}
                display={"inline-block"}
              >
                {message.text}
              </Box>
              <Text fontSize={"small"}>{message.createdAt}</Text>
            </HStack>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default ChatBubble;
