import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import SharedLayout from "./components/SharedLayout/SharedLayout";
import RecommendedPage from "./components/RecommendedPage/RecommendedPage";
import LibraryPage from "./pages/LibraryPage/LibraryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Açık Rotalar */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Yetkili (Korumalı) Rotalar - SharedLayout Altında Çalışır */}
        <Route
          element={
            <PrivateRoute>
              <SharedLayout />
            </PrivateRoute>
          }
        >
          <Route path="/recommended" element={<RecommendedPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;