import { Box } from "@chakra-ui/react";
import { PreviewChat } from "../../types/chats";
import ChatPreview from "./ChatPreview";

const ChatList = ({ chatList }: { chatList: Array<PreviewChat> }) => {
  return (
    <Box overflowY={"auto"} h={"calc(100vh - 12.5%)"}>
      {chatList.map((chat) => {
        return <ChatPreview key={chat.chatId} chat={chat} />;
      })}
    </Box>
  );
};

export default ChatList;
