import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // User is not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but doesn't have permission
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "PROVIDER") {
      return <Navigate to="/provider" replace />;
    }

    return <Navigate to="/customer" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;