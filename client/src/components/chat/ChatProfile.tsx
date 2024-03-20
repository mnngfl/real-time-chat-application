import { Box, Circle, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { socketState, userState } from "../../state";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import useAlertDialog from "../../hooks/useAlertDialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { getProfile } from "../../services/users";
import EditAvatarModal from "./EditAvatarModal";
import UserAvatar from "../common/UserAvatar";
import UserSearchIcon from "@/assets/ico_user_search.svg?react";
import LogoutIcon from "@/assets/ico_exit.svg?react";
import SearchUserModal from "./SearchUserModal";
import useFetchChats from "@/hooks/useFetchChats";

const ChatProfile = () => {
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const { openAlert, closeAlert } = useAlertDialog();
  const socket = useRecoilValue(socketState);
  const navigate = useNavigate();
  const { fetchChats } = useFetchChats();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleEdit = () => {
    setShowProfileModal(true);
  };

  const handleProfileSuccess = async () => {
    try {
      const res = await getProfile();
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
      const res = await getProfile();
      setUser((prev) => ({ ...prev, avatar: res.avatar }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchModal = () => {
    setShowSearchModal(true);
  };

  const handleCreateChatSuccess = async () => {
    try {
      await fetchChats();
    } catch (error) {
      console.log(error);
    }
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
      <Flex alignItems={"center"} p={12}>
        <>
          <UserAvatar avatar={user.avatar} />
          <Tooltip label="Edit Avatar">
            <Circle
              bg={"blue.500"}
              size={"1.5em"}
              position={"relative"}
              left={"-1em"}
              top={"1.15em"}
              borderColor={"gray.800"}
              borderWidth={3}
              _hover={{ cursor: "pointer" }}
              onClick={() => handleAvatar()}
            >
              <AddIcon boxSize={"0.65em"} />
            </Circle>
          </Tooltip>
        </>
        <Box ml={4} flex={1}>
          <Text
            fontSize={"xl"}
            fontWeight={"semibold"}
            noOfLines={1}
            wordBreak={"break-all"}
          >
            {user?.nickname || "Anonymous"}
          </Text>
          <Text fontSize={"sm"}>({user?.userName})</Text>
        </Box>
        <Flex alignItems={"center"}>
          <Tooltip label="Edit Profile">
            <EditIcon
              boxSize={4}
              ml={3}
              onClick={() => handleEdit()}
              _hover={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip label="Find Users">
            <Icon
              viewBox="0 0 24 24 "
              boxSize={5}
              ml={6}
              onClick={() => handleSearchModal()}
              _hover={{ cursor: "pointer" }}
            >
              <UserSearchIcon />
            </Icon>
          </Tooltip>
          <Tooltip label="Logout">
            <Icon
              viewBox="0 0 24 24 "
              boxSize={5}
              ml={6}
              onClick={() => handleLogout()}
              _hover={{ cursor: "pointer" }}
            >
              <LogoutIcon />
            </Icon>
          </Tooltip>
        </Flex>
      </Flex>
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
