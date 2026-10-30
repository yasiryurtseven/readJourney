import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addBookToLibrary } from "../../services/booksApi";
import BookSuccessModal from "../BookSuccessModal/BookSuccessModal";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import styles from "./BookModal.module.css";

export default function BookModal({ book, onClose, onAdded }) {
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isSuccessOpen) setIsSuccessOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSuccessOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isSuccessOpen) setIsSuccessOpen(false);
      else onClose();
    }
  };

  const handleAddBook = async () => {
    try {
      await addBookToLibrary(book._id || book.id);
      if (onAdded) onAdded();
      // Detay modalını kapatıp başarı modalını açıyoruz
      setIsSuccessOpen(true);
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to add book to library",
      });
    }
  };

  if (!book) return null;

  return (
    <>
      {/* Eğer başarı modalı açık değilse Kitap Detay Modalı görünür */}
      {!isSuccessOpen ? (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>

            <div className={styles.bookInfo}>
              <div className={styles.coverWrapper}>
                <img src={book.imageUrl || book.image} alt={book.title} className={styles.bookCover} />
              </div>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>{book.author}</p>
              <span className={styles.bookPages}>{book.totalPages ? `${book.totalPages} pages` : ""}</span>
            </div>

            <button className={styles.addBtn} onClick={handleAddBook}>
              Add to library
            </button>
          </div>
        </div>
      ) : (
        /* Başarı Modalı (Good Job) */
        <BookSuccessModal
          onClose={() => {
            setIsSuccessOpen(false);
            onClose();
          }}
          onGoToLibrary={() => {
            setIsSuccessOpen(false);
            onClose();
            navigate("/library");
          }}
        />
      )}
    </>
  );
}