import EmojiPicker, { EmojiClickData, SuggestionMode, Theme } from "emoji-picker-react";
import { forwardRef, type HTMLAttributes } from "react";

export type ChatEmojiProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  handler: (emojiData: EmojiClickData) => void;
};

const ChatEmoji = forwardRef<HTMLDivElement, ChatEmojiProps>((props, ref) => {
  return (
    <div ref={ref}>
      <EmojiPicker
        open={props.open}
        lazyLoadEmojis={true}
        suggestedEmojisMode={SuggestionMode.RECENT}
        skinTonesDisabled={true}
        searchDisabled={true}
        theme={Theme.DARK}
        onEmojiClick={(emojiData) => props.handler(emojiData)}
        style={{
          position: "absolute",
          bottom: "4.5em",
        }}
      />
    </div>
  );
});

export default ChatEmoji;
