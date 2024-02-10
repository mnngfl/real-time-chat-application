import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import DividerWithDate from "./DividerWithDate";

const ChatRoom = () => {
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

  return (
    <>
      <Flex mb={4}>
        <Center>
          <Avatar mr={4} />
          <Text fontSize={"xl"}>Name</Text>
        </Center>
      </Flex>
      <Divider />
      <Box h={"85%"} overflowY={"auto"} paddingY={4} bgColor={"gray.700"}>
        <ChatBubble />
        <DividerWithDate date={"Today"} bgColor={"gray.700"} />
        <ChatBubble />
      </Box>
      <Divider />
      <Flex paddingY={4}>
        <InputGroup>
          <InputLeftElement>
            <Icon viewBox="0 0 24 24" boxSize={6} color="gray.300">
              {/* <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.4 13.8C8.4 13.8 9.75 15.6 12 15.6C14.25 15.6 15.6 13.8 15.6 13.8M14.7 9.3H14.709M9.3 9.3H9.309M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15.15 9.3C15.15 9.54853 14.9485 9.75 14.7 9.75C14.4515 9.75 14.25 9.54853 14.25 9.3C14.25 9.05147 14.4515 8.85 14.7 8.85C14.9485 8.85 15.15 9.05147 15.15 9.3ZM9.75 9.3C9.75 9.54853 9.54853 9.75 9.3 9.75C9.05147 9.75 8.85 9.54853 8.85 9.3C8.85 9.05147 9.05147 8.85 9.3 8.85C9.54853 8.85 9.75 9.05147 9.75 9.3Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Icon>
          </InputLeftElement>
          <Input
            placeholder="Type something..."
            borderColor="gray.900"
            focusBorderColor="gray.900"
          />
          <InputRightElement>
            <Icon viewBox="0 0 24 24" boxSize={6} color="gray.300">
              {/* <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM8.64 12.81L13.02 8.43H10.59C10.18 8.43 9.84 8.09 9.84 7.68C9.84 7.27 10.18 6.93 10.59 6.93H14.83C14.93 6.93 15.02 6.95 15.12 6.99C15.3 7.07 15.45 7.21 15.53 7.4C15.57 7.49 15.59 7.59 15.59 7.69V11.93C15.59 12.34 15.25 12.68 14.84 12.68C14.43 12.68 14.09 12.34 14.09 11.93V9.5L9.7 13.87C9.55 14.02 9.36 14.09 9.17 14.09C8.98 14.09 8.79 14.02 8.64 13.87C8.35 13.58 8.35 13.1 8.64 12.81ZM18.24 17.22C16.23 17.89 14.12 18.23 12 18.23C9.88 18.23 7.77 17.89 5.76 17.22C5.37 17.09 5.16 16.66 5.29 16.27C5.42 15.88 5.84 15.66 6.24 15.8C9.96 17.04 14.05 17.04 17.77 15.8C18.16 15.67 18.59 15.88 18.72 16.27C18.84 16.67 18.63 17.09 18.24 17.22Z"
                  fill="white"
                />
              </svg>
            </Icon>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </>
  );
};

export default ChatRoom;