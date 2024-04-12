import { Center, Spinner } from "@chakra-ui/react";

const ComponentLoading = () => {
  return (
    <Center w={"100%"} h={"100%"}>
      <Spinner thickness="4px" speed="0.6s" emptyColor="gray.200" color="blue.500" size={"xl"} />
    </Center>
  );
};

export default ComponentLoading;
