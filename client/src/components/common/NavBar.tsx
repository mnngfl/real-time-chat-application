import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { socketState, userState } from "../../state";
import { useNavigate } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";

const NavBar = () => {
  const navigate = useNavigate();
  const socket = useRecoilValue(socketState);
  const [user, setUser] = useRecoilState(userState);

  const handleLogout = () => {
    if (!user || !socket) return;
    socket.emit("logout", user._id);

    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box w="10%" bg="gray.900" color="white">
      <VStack
        h="100%"
        paddingX={8}
        paddingY={12}
        justifyContent={"space-between"}
      >
        <Box>
          <VStack _hover={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <ChatIcon boxSize={8} />
            <Text fontSize={"sm"}>Chatting</Text>
          </VStack>
        </Box>
        <VStack>
          <Box>
            <Button
              onClick={() => handleLogout()}
              _hover={{ bgColor: "gray.300" }}
            >
              Logout
            </Button>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default NavBar;
