import Cookies from "universal-cookie";
import { Navigate, Outlet } from "react-router-dom";

const cookies = new Cookies()

const ProtectedRoute = () => {
  const token = cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

    return <Outlet />;

};

export default ProtectedRoute;
