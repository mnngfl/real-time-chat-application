import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Flex } from "@chakra-ui/react";
import NavBar from "./components/common/NavBar";

function App() {
  return (
    <Flex height={"100vh"}>
      <NavBar />
      <>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </Flex>
  );
}

export default App;
