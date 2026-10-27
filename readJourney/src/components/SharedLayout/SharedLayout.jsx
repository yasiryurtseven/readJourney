import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { logoutUser } from "../../services/authApi";
import styles from "./SharedLayout.module.css";

export default function SharedLayout() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className={styles.sharedLayout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📖</span> READ JOURNEY
        </div>

        {/* Masaüstü Navigasyonu */}
        <nav className={styles.userNav}>
          <NavLink to="/recommended" className={({ isActive }) => (isActive ? styles.active : "")}>
            Home
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => (isActive ? styles.active : "")}>
            My library
          </NavLink>
        </nav>

        {/* Masaüstü Sağ Alan (UserBar + Logout) */}
        <div className={styles.userBarContainer}>
          <div className={styles.userBar}>
            <span className={styles.userAvatar}>{userInitial}</span>
            <span className={styles.userName}>{userName}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
        </div>

        {/* Mobil Hamburger Butonu ve Avatar */}
        <div className={styles.mobileHeaderControls}>
          <div className={styles.userAvatar}>{userInitial}</div>
          <button onClick={toggleMenu} className={styles.hamburgerBtn} aria-label="Open menu">
            ☰
          </button>
        </div>
      </header>

      {/* Mobil Menü / Drawer */}
      {isMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMenu}>
          <div className={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeMenu} className={styles.closeBtn}>
              ✕
            </button>
            <nav className={styles.mobileNav}>
              <NavLink to="/recommended" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : "")}>
                Home
              </NavLink>
              <NavLink to="/library" onClick={closeMenu} className={({ isActive }) => (isActive ? styles.active : "")}>
                My library
              </NavLink>
            </nav>
            <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
              Log out
            </button>
          </div>
        </div>
      )}

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}