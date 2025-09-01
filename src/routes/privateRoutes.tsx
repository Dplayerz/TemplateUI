import { Navigate } from "react-router-dom";
import { useAuth } from "src/authContex";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();

  // If no user, redirect to /sign-in
  if (!user) return <Navigate to="/sign-in" replace />;

  return children;
};
