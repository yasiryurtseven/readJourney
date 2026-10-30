import BookItem from "../BookItem/BookItem";
import styles from "./BookList.module.css";

export default function BookList({ books, onDelete }) {
  if (!books || books.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No books found in your library.</p>
      </div>
    );
  }

  return (
    <div className={styles.booksGrid}>
      {books.map((book) => (
        <BookItem key={book._id || book.id} book={book} onDelete={onDelete} />
      ))}
    </div>
  );
}