import { useState, useEffect, useCallback } from "react";
import { getOwnBooks, addBookToLibrary, removeBookFromLibrary, startWorkout, getRecommendedBooks } from "../../services/booksApi"; // getRecommendedBooks buraya eklendi
import MyBookForm from "../../components/Library/MyBookForm/MyBookForm";
import MyWorkout from "../../components/Library/MyWorkout/MyWorkout";
import BookList from "../../components/Library/BookList/BookList";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import styles from "./LibraryPage.module.css";

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

 const fetchLibraryData = useCallback(async () => {
    try {
      setLoading(true);
      const ownResponse = await getOwnBooks();
      setBooks(ownResponse.results || ownResponse.books || ownResponse);

      try {
        const recResponse = await getRecommendedBooks(); // booksApi üzerinden çağrılıyor
        const recData = recResponse.results || recResponse.books || recResponse;
        setRecommendedBooks(recData.slice(0, 3));
      } catch (recError) {
        console.log("Recommended books fetch error:", recError);
      }

    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to load library data",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibraryData();
  }, [fetchLibraryData]);

  const handleAddBook = async (formData) => {
    try {
      const newBook = await addBookToLibrary(formData);
      setBooks((prev) => [...prev, newBook.book || newBook]);
      iziToast.success({
        title: "Success",
        message: "Book added to library successfully",
      });
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to add book",
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBookFromLibrary(bookId);
      setBooks((prev) => prev.filter((book) => (book._id || book.id) !== bookId));
      iziToast.success({
        title: "Success",
        message: "Book removed from library",
      });
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to remove book",
      });
    }
  };

  const handleWorkoutStarted = (workoutData) => {
    console.log("Workout started:", workoutData);
    iziToast.success({
      title: "Success",
      message: "Reading training started!",
    });
  };

  const filteredBooks = books.filter((book) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread" && book.status === "unread") return true;
    if (activeFilter === "in-progress" && book.status === "in-progress") return true;
    if (activeFilter === "done" && book.status === "done") return true;
    return true;
  });

  return (
    <div className={styles.libraryPage}>
      {/* Sol Sütun: Form, Workout Başlatma ve Recommended Books Widget'ı */}
      <aside className={styles.leftSidebar}>
        <div className={styles.formCardWrapper}>
          <h3 className={styles.sidebarTitle}>Create your library:</h3>
          <MyBookForm onAddBook={handleAddBook} />
        </div>

        {/* Workout Modülü */}
        <MyWorkout books={books} onWorkoutStarted={handleWorkoutStarted} />

        {/* Geri Getirdiğimiz Recommended Books Mini Widget'ı */}
        <div className={styles.recommendedWidget}>
          <h4 className={styles.widgetTitle}>Recommended books</h4>
          <div className={styles.recBooksMiniGrid}>
            {recommendedBooks.map((rec) => (
              <div key={rec._id || rec.id} className={styles.recMiniCard}>
                <img src={rec.imageUrl || rec.image} alt={rec.title} className={styles.recMiniCover} />
                <div className={styles.recMiniInfo}>
                  <p className={styles.recMiniName}>{rec.title}</p>
                  <span className={styles.recMiniAuthor}>{rec.author}</span>
                </div>
              </div>
            ))}
          </div>
          <a href="/recommended" className={styles.recLink}>
            Home &rarr;
          </a>
        </div>
      </aside>

      {/* Sağ Sütun: My Library Liste Alanı */}
      <main className={styles.mainContent}>
        <div className={styles.libraryHeader}>
          <h2 className={styles.pageTitle}>My library</h2>
          <div className={styles.filterDropdownWrapper}>
            <select 
              value={activeFilter} 
              onChange={(e) => setActiveFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All books</option>
              <option value="unread">To read</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className={styles.loadingText}>Loading library...</p>
        ) : filteredBooks.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyBookIcon}>📚</div>
            <p className={styles.emptyText}>
              To start training, add some of your books or from the recommended ones
            </p>
          </div>
        ) : (
          <BookList books={filteredBooks} onDelete={handleDeleteBook} />
        )}
      </main>
    </div>
  );
}