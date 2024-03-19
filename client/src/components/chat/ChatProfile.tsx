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

const ChatProfile = () => {
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const { openAlert, closeAlert } = useAlertDialog();
  const socket = useRecoilValue(socketState);
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
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
          <Text fontSize={"xl"} fontWeight={"semibold"}>
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
          <Tooltip label="Logout">
            <Icon
              viewBox="0 0 24 24 "
              boxSize={5}
              ml={6}
              onClick={() => handleLogout()}
              _hover={{ cursor: "pointer" }}
            >
              {/* <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 7.63636L14 4.5C14 4.22386 13.7761 4 13.5 4L4.5 4C4.22386 4 4 4.22386 4 4.5L4 19.5C4 19.7761 4.22386 20 4.5 20L13.5 20C13.7761 20 14 19.7761 14 19.5L14 16.3636"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 12L21 12M21 12L18.0004 8.5M21 12L18 15.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Icon>
          </Tooltip>
        </Flex>
      </Flex>
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSuccess={() => handleProfileSuccess()}
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
