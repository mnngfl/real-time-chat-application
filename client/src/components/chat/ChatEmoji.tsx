import EmojiPicker, {
  EmojiClickData,
  SuggestionMode,
  Theme,
} from "emoji-picker-react";
import type { FC } from "react";

export type ChatEmojiProps = {
  open: boolean;
  handler: (emojiData: EmojiClickData) => void;
};

const ChatEmoji: FC<ChatEmojiProps> = ({ open, handler }) => {
  return (
    <EmojiPicker
      open={open}
      lazyLoadEmojis={true}
      suggestedEmojisMode={SuggestionMode.RECENT}
      skinTonesDisabled={true}
      searchDisabled={true}
      theme={Theme.DARK}
      onEmojiClick={(emojiData) => handler(emojiData)}
      style={{
        position: "absolute",
        bottom: "4.5em",
      }}
    />
  );
};

export default ChatEmoji;
