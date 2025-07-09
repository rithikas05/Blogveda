import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Protects routes from unauthenticated access.
 * If the token is missing, redirect to login with toast.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("userToken");

  if (!token) {
    toast.dismiss(); // Avoid duplicate toasts
    toast.error("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
