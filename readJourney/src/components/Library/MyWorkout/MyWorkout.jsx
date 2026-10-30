import { useState } from "react";
import { startWorkout } from "../../../services/booksApi";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import styles from "./MyWorkout.module.css";

export default function MyWorkout({ books, onWorkoutStarted }) {
  const [selectedBookId, setSelectedBookId] = useState("");
  const [startPage, setStartPage] = useState("1"); // Başlangıç sayfa alanı

  const handleStart = async (e) => {
    e.preventDefault();
    if (!selectedBookId) {
      iziToast.warning({
        title: "Warning",
        message: "Please select a book to start training",
      });
      return;
    }

    try {
      // Backend'in zorunlu tuttuğu 'page' alanı ile birlikte gönderiyoruz
      const data = await startWorkout({
        id: selectedBookId,
        page: Number(startPage) || 1,
      });

      iziToast.success({
        title: "Success",
        message: "Workout started successfully!",
      });

      if (onWorkoutStarted) {
        onWorkoutStarted(data);
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to start workout",
      });
    }
  };

  const availableBooks = books.filter((book) => book.status !== "done");

  return (
    <div className={styles.workoutCard}>
      <h3 className={styles.workoutTitle}>Start your reading:</h3>
      
      <form onSubmit={handleStart} className={styles.workoutForm}>
        <div className={styles.inputGroup}>
          <label>1. Choose a book from your library</label>
          <select 
            value={selectedBookId} 
            onChange={(e) => setSelectedBookId(e.target.value)}
            className={styles.selectField}
          >
            <option value="">My book</option>
            {availableBooks.map((book) => (
              <option key={book._id || book.id} value={book._id || book.id}>
                {book.title} ({book.author})
              </option>
            ))}
          </select>
        </div>

        {/* Backend'in istediği page alanı için input */}
        <div className={styles.inputGroup}>
          <label>Starting page number</label>
          <input 
            type="number" 
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            placeholder="1"
            className={styles.inputField}
          />
        </div>

        <div className={styles.stepInfo}>
          <p>2. Define your goal, choose a period, start training.</p>
        </div>

        <button type="submit" className={styles.startBtn}>
          Start training
        </button>
      </form>
    </div>
  );
}