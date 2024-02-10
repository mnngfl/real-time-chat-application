import { Avatar, Box, Flex, HStack, Text } from "@chakra-ui/react";

const ChatBubble = () => {
  return (
    <Flex flexDir={"row"}>
      <Avatar size={"xs"} />
      <Box ml={3}>
        <HStack mb={2}>
          <Text fontWeight={600}>User Name</Text>
          <Text fontSize={"small"}>12:34 PM</Text>
        </HStack>
        <Box
          w="auto"
          p={2}
          mr={"25%"}
          mb={3}
          bgColor={"gray.300"}
          borderRadius={8}
          borderTopLeftRadius={0}
          display={"inline-block"}
        >
          Lorem ipsum
        </Box>
        <Box
          p={2}
          mr={"25%"}
          mb={3}
          bgColor={"gray.300"}
          borderRadius={8}
          borderTopLeftRadius={0}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam.
        </Box>
        <Box
          p={2}
          mr={"25%"}
          bgColor={"gray.300"}
          borderRadius={8}
          borderTopLeftRadius={0}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
          libero. Sed cursus ante dapibus diam.
        </Box>
      </Box>
    </Flex>
  );
};

export default ChatBubble;
