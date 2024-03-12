import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInSelector } from "../../state";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
