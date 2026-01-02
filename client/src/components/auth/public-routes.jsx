import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/admin-auth-context";
import Loader from "../shared/loader";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PublicRoute;

