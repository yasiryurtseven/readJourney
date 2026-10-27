import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  // Token varsa Recommended sayfasına yönlendir (örn: login sayfasına tekrar girmesin)
  return !token ? children : <Navigate to="/recommended" replace />;
}