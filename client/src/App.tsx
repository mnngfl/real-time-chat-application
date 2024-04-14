import { Flex } from "@chakra-ui/react";
import RoutesSetup from "@/routes/RoutesSetup";
import { lazy } from "react";

const AlertOverlay = lazy(() => import("@/components/common/AlertOverlay"));

function App() {
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
