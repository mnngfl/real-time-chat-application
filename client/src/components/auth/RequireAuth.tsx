import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({
  children,
  isLoggedIn,
}: {
  children: JSX.Element;
  isLoggedIn: boolean;
}) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
