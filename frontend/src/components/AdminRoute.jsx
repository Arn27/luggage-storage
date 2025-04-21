import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token || !roles.includes("admin")) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
