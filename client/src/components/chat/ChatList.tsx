import { Box } from "@chakra-ui/react";
import { PreviewChat } from "../../types/chats";
import ChatPreview from "./ChatPreview";

const ChatList = ({ chats }: { chats: Array<PreviewChat> }) => {
  return (
    <Box overflowY={"auto"} h={"calc(100vh - 37%)"}>
      {chats.map((chat) => {
        return <ChatPreview key={chat.chatId} chat={chat} />;
      })}
    </Box>
  );
};

export default ChatList;
