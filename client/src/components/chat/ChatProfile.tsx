import { Box, Circle, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { socketState, userState } from "@/state";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useAlertDialog, useFetchChats, useResponsive } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EditProfileModal, EditAvatarModal, SearchUserModal } from "@/components/chat";
import { getProfile } from "@/services/users";
import { UserAvatar } from "@/components/common";
import UserSearchIcon from "@/assets/ico_user_search.svg?react";
import LogoutIcon from "@/assets/ico_exit.svg?react";

const ChatProfile = () => {
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const { openAlert, closeAlert } = useAlertDialog();
  const socket = useRecoilValue(socketState);
  const navigate = useNavigate();
  const { fetchChats } = useFetchChats();
  const { isPc } = useResponsive();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleEdit = () => {
    setShowProfileModal(true);
  };

  const handleProfileSuccess = async () => {
    try {
      const { data: res } = await getProfile();
      setUser((prev) => ({ ...prev, nickname: res.nickname }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatar = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarSuccess = async () => {
    try {
      const { data: res } = await getProfile();
      setUser((prev) => ({ ...prev, avatar: res.avatar }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchModal = () => {
    setShowSearchModal(true);
  };

  const handleCreateChatSuccess = async () => {
    await fetchChats();
  };

  const handleLogout = () => {
    openAlert("Logout", "Do you want to logout?", {
      label: "Logout",
      handler: () => {
        if (!user || !socket) return;

        socket.emit("logout", user?._id);
        resetUser();
        navigate("/login");
        closeAlert();
      },
    });
  };

  return (
    <>
      {isPc ? (
        <Flex alignItems={"center"} p={8}>
          <>
            <UserAvatar avatar={user.avatar} />
            <Tooltip hasArrow label="Edit Avatar" shadow={"none"} bg="surface-variant" color="on-surface-variant">
              <Circle
                bg={"primary"}
                size={"1.5em"}
                position={"relative"}
                left={"-1em"}
                top={"1.15em"}
                borderColor={"on-secondary"}
                borderWidth={3}
                _hover={{ cursor: "pointer" }}
                onClick={() => handleAvatar()}
              >
                <AddIcon boxSize={"0.65em"} color={"on-secondary"} />
              </Circle>
            </Tooltip>
          </>
          <Box ml={0} flex={1}>
            <Tooltip label={user?.nickname || "Anonymous"} placement={"bottom-start"}>
              <Text fontSize={"xl"} fontWeight={"semibold"} noOfLines={1} wordBreak={"break-all"}>
                {user?.nickname || "Anonymous"}
              </Text>
            </Tooltip>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"sm"}>({user?.userName})</Text>
              <Flex alignItems={"center"}>
                <Tooltip hasArrow label="Edit Profile" bg="surface-variant" color="on-surface-variant">
                  <Icon
                    viewBox="0 0 24 24"
                    color="on-secondary-container"
                    boxSize={4}
                    ml={2}
                    onClick={() => handleEdit()}
                    _hover={{ cursor: "pointer" }}
                  >
                    <EditIcon />
                  </Icon>
                </Tooltip>
                <Tooltip hasArrow label="Find Users" bg="surface-variant" color="on-surface-variant">
                  <Icon
                    viewBox="0 0 24 24"
                    color="on-secondary-container"
                    boxSize={5}
                    ml={4}
                    onClick={() => handleSearchModal()}
                    _hover={{ cursor: "pointer" }}
                  >
                    <UserSearchIcon />
                  </Icon>
                </Tooltip>
                <Tooltip hasArrow label="Logout" bg="surface-variant" color="on-surface-variant">
                  <Icon
                    viewBox="0 0 24 24"
                    color="on-secondary-container"
                    boxSize={5}
                    ml={4}
                    onClick={() => handleLogout()}
                    _hover={{ cursor: "pointer" }}
                  >
                    <LogoutIcon />
                  </Icon>
                </Tooltip>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Box py={8}>
          <Flex
            flexDir={"column"}
            cursor={"pointer"}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={() => setShowSearchModal(true)}
          >
            <EditIcon boxSize={6} mb={1} />
            <Text fontSize={"small"}>New Chat</Text>
          </Flex>
        </Box>
      )}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSuccess={() => handleProfileSuccess()}
      />
      <SearchUserModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSuccess={() => handleCreateChatSuccess()}
      />
      <EditAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSuccess={() => handleAvatarSuccess()}
      />
    </>
  );
};

export default ChatProfile;
