import { Box, VStack } from "@chakra-ui/react";

const NavBar = () => {
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
          <Box>Login</Box>
          <Box>Profile</Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default NavBar;
