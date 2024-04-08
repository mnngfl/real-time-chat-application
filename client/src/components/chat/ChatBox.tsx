import { Flex, Icon, InputGroup, InputLeftElement, InputRightElement, Textarea } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FC, RefObject } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentChatState, socketState, userIdSelector, userNameSelector } from "@/state";
import ChatEmoji from "./ChatEmoji";
import { EmojiClickData } from "emoji-picker-react";
import { useAlertDialog } from "@/hooks";
import SmileIcon from "@/assets/ico_smile.svg?react";
import SendIcon from "@/assets/ico_send.svg?react";

export type ChatBoxProps = {
  boxRef: RefObject<HTMLDivElement>;
};

const ChatBox: FC<ChatBoxProps> = ({ boxRef }) => {
  const { openAlert } = useAlertDialog();
  const [socket] = useRecoilState(socketState);
  const userId = useRecoilValue(userIdSelector);
  const userName = useRecoilValue(userNameSelector);
  const currentChat = useRecoilValue(currentChatState);
  const [inputText, setInputText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleClickEmojiOutside = useCallback((e: MouseEvent) => {
    if (!emojiRef.current?.contains(e.target as Node)) {
      setTimeout(() => {
        setShowPicker(false);
      }, 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickEmojiOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickEmojiOutside);
    };
  }, [handleClickEmojiOutside]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setInputText(value);
  };

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      await handleSubmit();
    }
  };

  const handleEmoji = (emojiData: EmojiClickData) => {
    setInputText(inputText + emojiData.emoji);
    setShowPicker(false);
  };

  const handleSubmit = async () => {
    const text = inputText.replace(/\n$/, "").trim();

    if (text.length === 0) {
      setInputText("");
      return;
    }

    try {
      if (!socket) return;
      const newMessage = {
        chatId: currentChat._id,
        text: text,
        sendUser: {
          _id: userId,
          userName: userName,
        },
        receiveUser: {
          _id: currentChat.userId,
          userName: currentChat.userName,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      socket.emit("sendMessage", newMessage);
      setInputText("");

      setTimeout(() => {
        if (boxRef.current) {
          boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
      }, 1);
    } catch (error) {
      openAlert("Send message Failed", error as string);
    }
  };

  return (
    <Flex paddingY={4}>
      <InputGroup>
        <InputLeftElement>
          <Icon
            viewBox="0 0 24 24"
            boxSize={6}
            color="gray.300"
            _hover={{ cursor: "pointer" }}
            onClick={() => setShowPicker(!showPicker)}
          >
            <SmileIcon />
          </Icon>
        </InputLeftElement>
        <ChatEmoji open={showPicker} handler={handleEmoji} ref={emojiRef} />
        <Textarea
          paddingX={10}
          placeholder="Type something...&#10;Press Shift + Enter to line break / Press Enter to send message"
          borderColor="gray.900"
          focusBorderColor="gray.300"
          name="text"
          resize={"none"}
          rows={2}
          value={inputText}
          onChange={(e) => handleChange(e)}
          onKeyUp={(e) => handleKeyUp(e)}
          style={{ scrollbarWidth: "none" }}
          maxLength={2000}
        />
        <InputRightElement _hover={{ cursor: "pointer" }} onClick={() => handleSubmit()}>
          <Icon viewBox="0 0 24 24" boxSize={6} color="gray.300">
            <SendIcon />
          </Icon>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default ChatBox;
