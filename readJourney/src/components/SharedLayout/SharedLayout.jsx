import { Outlet, NavLink, useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { logoutUser } from "../../services/authApi";
import styles from "./SharedLayout.module.css";

export default function SharedLayout() {
  const navigate = useNavigate();

  // LocalStorage'dan giriş yapan kullanıcının adını alalım (Yoksa varsayılan gösterelim)
  const userName = localStorage.getItem("userName") || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      iziToast.error({
        title: "Warning",
        message: error.response?.data?.message || "Logout warning",
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      navigate("/login");
      iziToast.success({ title: "Success", message: "Logged out successfully" });
    }
  };

  return (
    <div className={styles.sharedLayout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📖</span> READ JOURNEY
        </div>

        <nav className={styles.userNav}>
          <NavLink to="/recommended" className={({ isActive }) => (isActive ? styles.active : "")}>
            Home
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => (isActive ? styles.active : "")}>
            My library
          </NavLink>
        </nav>

        <div className={styles.userBarContainer}>
          <div className={styles.userBar}>
            <span className={styles.userAvatar}>{userInitial}</span>
            <span className={styles.userName}>{userName}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}