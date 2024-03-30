import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInSelector } from "../../state";
import type { FC, PropsWithChildren } from "react";

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
