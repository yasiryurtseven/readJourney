import { useEffect } from "react";
import styles from "./BookSuccessModal.module.css";

export default function BookSuccessModal({ onClose, onGoToLibrary }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.iconWrapper}>👍</div>
          <h3 className={styles.title}>Good job</h3>
          <p className={styles.message}>
            The book is now in your library. The joy is real and it&apos;s time for you to start your reading
          </p>
          <button className={styles.libraryBtn} onClick={onGoToLibrary}>
            To my library &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}