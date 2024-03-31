import { Box } from "@chakra-ui/react";
import { PreviewChat } from "../../types/chats";
import ChatPreview from "./ChatPreview";
import type { FC } from "react";

export type ChatListProps = {
  chatList: Array<PreviewChat>;
};

const ChatList: FC<ChatListProps> = ({ chatList }) => {
  return (
    <Box overflowY={"auto"} h={"calc(100vh - 12.5%)"}>
      {chatList.map((chat) => {
        return <ChatPreview key={chat.chatId} chat={chat} />;
      })}
    </Box>
  );
};

export default ChatList;
