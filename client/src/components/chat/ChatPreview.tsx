import { Avatar, Flex, Icon, Text, VStack } from "@chakra-ui/react";

const ChatPreview = () => {
  return (
    <Flex color={"white"} paddingX={12} paddingY={6} alignItems={"center"}>
      <Avatar src="#" />
      <Flex justifyContent={"space-between"}>
        <VStack alignItems={"start"} ml={4}>
          <Text fontWeight={"bold"}>Name</Text>
          <Text fontSize={"small"} lineHeight="tight" noOfLines={1}>
            Content Content Content Content Content Content Content Content
            Content
          </Text>
        </VStack>
        <VStack alignItems={"end"} ml={4}>
          <Text fontSize={"small"} whiteSpace={"nowrap"}>
            12:34 PM
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
