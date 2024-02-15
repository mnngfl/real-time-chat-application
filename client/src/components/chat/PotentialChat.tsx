import {
  Avatar,
  Flex,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { BaseUser } from "../../types/users";
import { getOtherUsers } from "../../services/users";
import { useRecoilValue } from "recoil";
import { userIdSelector } from "../../state";
import { chatListState } from "../../state/atoms/chatState";
import { createChat } from "../../services/chats";
import { useAlertDialog } from "../../context/AlertDialogProvider";

const PotentialChat = ({ fetchChats }: { fetchChats: () => Promise<void> }) => {
  const userId = useRecoilValue(userIdSelector);
  const chatList = useRecoilValue(chatListState);
  const [users, setUsers] = useState<Array<BaseUser> | []>([]);
  const { openAlert } = useAlertDialog();

  const getPotentialUsers = useCallback(async () => {
    const res = await getOtherUsers();
    if (res && chatList?.length > 0) {
      const pUsers = res.filter((user) => {
        const isChatCreated = chatList.some((chat) => {
          return (
            chat.joinedUsers[0]._id === user._id ||
            chat.joinedUsers[1]._id === user._id
          );
        });
        return !isChatCreated;
      });
      setUsers(pUsers);
    }
  }, [chatList]);

  useEffect(() => {
    if (!userId) return;
    getPotentialUsers();
  }, [getPotentialUsers, userId]);

  const createNewChat = async (recipientId: string) => {
    try {
      await createChat({ recipientId: recipientId });
      fetchChats();
    } catch (error) {
      openAlert("Create chat Failed", error as string);
    }
  };

  return (
    <Popover defaultIsOpen={true} placement="top">
      <PopoverAnchor>
        <Flex h={"15%"} overflowX={"auto"} p={6}>
          {users.length > 0 &&
            users.map((user, index) => {
              return (
                <VStack
                  key={user._id}
                  ml={index === 0 ? "0" : "6"}
                  _hover={{ cursor: "pointer", transform: "scale(1.05)" }}
                  onClick={() => createNewChat(user._id)}
                >
                  <Avatar />
                  <Text>{user.userName}</Text>
                </VStack>
              );
            })}
        </Flex>
      </PopoverAnchor>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton color={"gray.600"} />
        <PopoverBody color={"gray.600"}>
          Click user to start chat...
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PotentialChat;
