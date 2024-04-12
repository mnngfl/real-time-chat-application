import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "@/components/auth";
import { useRecoilValue } from "recoil";
import { isLoggedInSelector } from "@/state";
import { lazy, Suspense } from "react";
import ComponentLoading from "@/components/common/ComponentLoading";

const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Chat = lazy(() => import("@/pages/Chat"));

export default function RoutesSetup() {
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  const LoginRedirect = () => {
    return isLoggedIn ? (
      <Navigate to="/" />
    ) : (
      <Suspense fallback={<ComponentLoading />}>
        <Login />
      </Suspense>
    );
  };

  const RegisterRedirect = () => {
    return isLoggedIn ? (
      <Navigate to="/" />
    ) : (
      <Suspense fallback={<ComponentLoading />}>
        <Register />
      </Suspense>
    );
  };

  return (
    <Routes>
      <Route path="/register" element={<RegisterRedirect />} />
      <Route path="/login" element={<LoginRedirect />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Suspense fallback={<ComponentLoading />}>
              <Chat />
            </Suspense>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
