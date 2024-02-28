import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Flex } from "@chakra-ui/react";
import NavBar from "./components/common/NavBar";
import { useRecoilValue } from "recoil";
import { isLoggedInSelector } from "./state";
import useRecoilInitialize from "./state/useRecoilInitialize";
import RequireAuth from "./components/auth/RequireAuth";
import AlertOverlay from "./components/common/AlertOverlay";

function App() {
  useRecoilInitialize();
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  const LoginRedirect = () => {
    return isLoggedIn ? <Navigate to="/" /> : <Login />;
  };

  const RegisterRedirect = () => {
    return isLoggedIn ? <Navigate to="/" /> : <Register />;
  };

  return (
    <>
      <Flex height={"100vh"} overflowY={"hidden"} bgColor={"gray.900"}>
        {isLoggedIn ? <NavBar /> : <></>}
        <Routes>
          <Route path="/register" element={<RegisterRedirect />} />
          <Route path="/login" element={<LoginRedirect />} />
          <Route
            path="/"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <Chat />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Flex>
      <AlertOverlay />
    </>
  );
}

export default App;
