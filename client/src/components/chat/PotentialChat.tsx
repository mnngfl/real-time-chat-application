import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  HStack,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseUser } from "../../types/users";
import { getOtherUsers } from "../../services/users";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  chatListState,
  onlineUserListState,
  userIdSelector,
} from "../../state";
import { createChat } from "../../services/chats";
import useAlertDialog from "../../hooks/useAlertDialog";
import useFetchChats from "../../hooks/useFetchChats";
import { PreviewChat } from "../../types/chats";

const PotentialChat = () => {
  const userId = useRecoilValue(userIdSelector);
  const chatList = useRecoilValueLoadable(chatListState);
  const onlineUserList = useRecoilValue(onlineUserListState);
  const [users, setUsers] = useState<Array<BaseUser> | []>([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const { openAlert } = useAlertDialog();
  const { fetchChats } = useFetchChats();
  const isLoaded = useMemo(
    () => chatList.state === "hasValue" && userLoaded === true,
    [chatList.state, userLoaded]
  );

  const isChatCreated = (user: BaseUser, chat: PreviewChat) =>
    chat.joinedUsers[0]._id === user._id ||
    chat.joinedUsers[1]._id === user._id;

  const getPotentialUsers = useCallback(async () => {
    if (chatList.state !== "hasValue") return;
    try {
      setUserLoaded(false);
      const res = await getOtherUsers();
      if (res) {
        const pUsers = res.filter(
          (user) =>
            !chatList?.contents.some((chat: PreviewChat) =>
              isChatCreated(user, chat)
            )
        );
        setUsers(pUsers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoaded(true);
    }
  }, [chatList]);

  useEffect(() => {
    if (!userId) return;
    getPotentialUsers();
  }, [getPotentialUsers, userId]);

  const createNewChat = async (recipientId: string) => {
    try {
      await createChat({ recipientId: recipientId });
      await fetchChats();
    } catch (error) {
      openAlert("Create chat Failed", error as string);
    }
  };

  return (
    <Popover defaultIsOpen={true} placement="top">
      <PopoverAnchor>
        <Flex
          h={"15%"}
          overflowX={"auto"}
          p={6}
          style={{ scrollbarWidth: "none", alignItems: "center" }}
        >
          <>
            {isLoaded ? (
              users.length === 0 ? (
                <Box>There's no user to start a chat with</Box>
              ) : (
                users.map((user, index) => {
                  const isOnlineUser = onlineUserList.some(
                    (onlineUser) => onlineUser.userId === user._id
                  );
                  return (
                    <VStack
                      key={user._id}
                      ml={index === 0 ? "0" : "6"}
                      _hover={{ cursor: "pointer", transform: "scale(1.05)" }}
                      onClick={() => createNewChat(user._id)}
                    >
                      <HStack>
                        <Avatar>
                          {isOnlineUser && (
                            <AvatarBadge bg="green.500" boxSize="1.25em" />
                          )}
                        </Avatar>
                      </HStack>
                      <Text>{user.userName}</Text>
                    </VStack>
                  );
                })
              )
            ) : (
              <VStack>
                <SkeletonCircle size="12" />
                <SkeletonText mt="4" noOfLines={1} width={12} />
              </VStack>
            )}
          </>
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
