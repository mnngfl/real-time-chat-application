import { getOtherUsers } from "@/services/users";
import { chatListState, onlineUserListState, userIdSelector } from "@/state";
import type { PreviewChat } from "@/types/chats";
import type { BaseUser } from "@/types/users";
import {
  AvatarBadge,
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { UserAvatar } from "@/components/common";
import { createChat } from "@/services/chats";
import { useAlertDialog } from "@/hooks";
import useErrorToast from "@/hooks/useErrorToast";

export type SearchUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const SearchUserModal: FC<SearchUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const userId = useRecoilValue(userIdSelector);
  const chatList = useRecoilValueLoadable(chatListState);
  const onlineUserList = useRecoilValue(onlineUserListState);
  const [users, setUsers] = useState<Array<BaseUser> | []>([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const { openAlert } = useAlertDialog();
  const [errorMessage, setErrorMessage] = useState<any>(null);
  useErrorToast(errorMessage);

  const isLoaded = useMemo(() => chatList.state === "hasValue" && userLoaded === true, [chatList.state, userLoaded]);

  const isChatCreated = (user: BaseUser, chat: PreviewChat) =>
    chat.joinedUsers[0]._id === user._id || chat.joinedUsers[1]._id === user._id;

  const getPotentialUsers = useCallback(async () => {
    if (chatList.state !== "hasValue") return;

    try {
      const { data: res } = await getOtherUsers();
      if (res) {
        const pUsers = res.filter((user) => !chatList?.contents.some((chat: PreviewChat) => isChatCreated(user, chat)));
        setUsers(pUsers);
      }
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setUserLoaded(true);
    }
  }, [chatList?.contents, chatList.state]);

  useEffect(() => {
    if (!userId || !isOpen) return;
    getPotentialUsers();
  }, [getPotentialUsers, userId, isOpen]);

  const createNewChat = async (recipientId: string) => {
    try {
      await createChat({ recipientId: recipientId });
      onSuccess();
      onClose();
    } catch (error) {
      openAlert("Create chat Failed", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Find Users</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Find friends to chat with! 👇</Text>
          <Box height={"26em"} overflowY={"auto"} mt={2}>
            {isLoaded ? (
              users.length === 0 ? (
                <Center height={"100%"}>There's no user to start a chat with...</Center>
              ) : (
                users.map((user, index) => {
                  const isOnlineUser = onlineUserList.some((onlineUser) => onlineUser.userId === user._id);
                  return (
                    <Fragment key={user._id}>
                      <HStack my={2} px={2}>
                        <UserAvatar avatar={user?.avatar}>
                          {isOnlineUser && <AvatarBadge bg={"green.500"} boxSize={"1.25em"} />}
                        </UserAvatar>
                        <Box alignItems={"start"} width={"70%"}>
                          <Text fontWeight={"semibold"} noOfLines={1} wordBreak={"break-all"}>
                            {user?.nickname || "Anonymous"}
                          </Text>
                          <Text fontSize={"small"}>({user.userName})</Text>
                        </Box>
                        <Button colorScheme="teal" variant={"outline"} onClick={() => createNewChat(user._id)}>
                          Create Room
                        </Button>
                      </HStack>
                      {index < users.length - 1 && <Divider />}
                    </Fragment>
                  );
                })
              )
            ) : (
              <HStack my={2} px={2}>
                <SkeletonCircle size="12" />
                <SkeletonText noOfLines={1} width={12} />
              </HStack>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchUserModal;
