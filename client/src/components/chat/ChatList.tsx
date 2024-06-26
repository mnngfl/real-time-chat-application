import { Box } from "@chakra-ui/react";
import type { PreviewChat } from "@/types/chats";
import { ChatPreview } from "@/components/chat";
import type { FC } from "react";

export type ChatListProps = {
  chatList: Array<PreviewChat>;
};

const ChatList: FC<ChatListProps> = ({ chatList }) => {
  return (
    <Box overflowY={"auto"} h={"calc(100vh - 21%)"}>
      {chatList.map((chat) => {
        return <ChatPreview key={chat.chatId} chat={chat} />;
      })}
    </Box>
  );
};

export default ChatList;
