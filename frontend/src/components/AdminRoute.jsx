import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
