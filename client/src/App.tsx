import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Flex } from "@chakra-ui/react";
import NavBar from "./components/common/NavBar";

function App() {
  const navigate = useNavigate();

  const isLoggedIn = true; // 로그인 상태 확인 로직 추가

  const handleLogout = () => {
    // 로그아웃 로직 추가
    navigate("/login");
  };

  return (
    <Flex height={"100vh"}>
      {isLoggedIn ? <NavBar /> : <></>}
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Flex>
  );
}

export default App;
