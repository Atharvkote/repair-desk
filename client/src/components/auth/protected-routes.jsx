import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/admin-auth-context";
import Loader from "../shared/loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

