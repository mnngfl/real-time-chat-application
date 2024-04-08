import { Routes, Route, Navigate } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Chat from "@/pages/Chat";
import { RequireAuth } from "@/components/auth";
import { useRecoilValue } from "recoil";
import { isLoggedInSelector } from "@/state";

export default function RoutesSetup() {
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  const LoginRedirect = () => {
    return isLoggedIn ? <Navigate to="/" /> : <Login />;
  };

  const RegisterRedirect = () => {
    return isLoggedIn ? <Navigate to="/" /> : <Register />;
  };

  return (
    <Routes>
      <Route path="/register" element={<RegisterRedirect />} />
      <Route path="/login" element={<LoginRedirect />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Chat />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
