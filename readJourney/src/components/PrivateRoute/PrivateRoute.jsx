import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  // Token yoksa login sayfasına yönlendir
  return token ? children : <Navigate to="/login" replace />;
}