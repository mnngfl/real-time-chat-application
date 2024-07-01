import { Center, Flex, Text } from "@chakra-ui/react";
import RoutesSetup from "@/routes/RoutesSetup";
import { lazy } from "react";
import useOnlineStatus from "./hooks/useOnlineStatus";

const AlertOverlay = lazy(() => import("@/components/common/AlertOverlay"));

function App() {
  const isOnline = useOnlineStatus();

  return (
    <>
      {isOnline === false && (
        <Center
          width={"100vw"}
          height={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
          bgColor={"background"}
          opacity={0.8}
          position={"absolute"}
          zIndex={100}
        >
          <Text color={"on-primary-container"} fontSize={"2xl"} textAlign={"center"} fontWeight={"bold"}>
            No network connection.
            <br />
            Please check your connection status.
          </Text>
        </Center>
      )}
      <Flex
        height={"100vh"}
        overflowY={"hidden"}
        bgColor={"background"}
        {...(isOnline === false && { pointerEvents: "none" })}
      >
        <RoutesSetup />
      </Flex>
      <AlertOverlay />
    </>
  );
}

export default App;
