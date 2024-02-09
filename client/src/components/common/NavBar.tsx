import { Box, Button, VStack } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { userState } from "../../state";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  const handleLogout = () => {
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
        <Box>Main</Box>
        <VStack>
          <Box>
            <Button onClick={() => handleLogout()}>Logout</Button>
          </Box>
          <Box>Hello, {user?.userName}!</Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default NavBar;
