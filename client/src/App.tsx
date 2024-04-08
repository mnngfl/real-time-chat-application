import { Flex } from "@chakra-ui/react";
import { AlertOverlay } from "@/components/common";
import { useSocket } from "@/hooks";
import RoutesSetup from "@/routes/RoutesSetup";

function App() {
  useSocket();

  return (
    <>
      <Flex height={"100vh"} overflowY={"hidden"} bgColor={"gray.900"}>
        <RoutesSetup />
      </Flex>
      <AlertOverlay />
    </>
  );
}

export default App;
