import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";

const Login = () => {
  return (
    <Container maxW={"container.sm"}>
      <Flex justifyContent={"center"} alignItems={"center"} h={"100%"}>
        <Box width={"32rem"} p={"4rem"} bg="gray.300" borderRadius={8}>
          <Text fontSize={"3xl"} fontWeight={500}>
            Login
          </Text>
          <FormControl isRequired my={4}>
            <Input placeholder="Enter your username" />
          </FormControl>

          <FormControl isRequired mb={4}>
            <Input type="password" placeholder="Enter your password" />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size={"lg"}
            my={4}
            w={"100%"}
          >
            Sign In
          </Button>

          <Text color={"gray.600"}>
            Not a member yet?{" "}
            <Link color="teal.500" href="/register" fontWeight={500}>
              Register
            </Link>
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;
