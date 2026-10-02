import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = () => {
  const status = useAuthStore((state) => state.status);

  if (status === "checking") {
    return <p>Loading</p>;
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
