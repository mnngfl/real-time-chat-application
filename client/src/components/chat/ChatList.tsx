import { BaseChat } from "../../types/chats";
import ChatPreview from "./ChatPreview";

const ChatList = ({ chats }: { chats: Array<BaseChat> }) => {
  return (
    <>
      {chats.map((chat) => {
        return <ChatPreview key={chat.chatId} chat={chat} />;
      })}
    </>
  );
};

export default ChatList;
