import styles from "./BookItem.module.css";

export default function BookItem({ book, onDelete }) {
  const bookId = book._id || book.id;

  return (
    <div className={styles.bookCard}>
      <div className={styles.coverWrapper}>
        <img 
          src={book.imageUrl || book.image || "https://via.placeholder.com/130x180"} 
          alt={book.title} 
          className={styles.bookCover} 
        />
      </div>
      <div className={styles.bookInfo}>
        <h4 className={styles.bookName} title={book.title}>{book.title}</h4>
        <p className={styles.bookAuthor} title={book.author}>{book.author}</p>
      </div>
      <button 
        className={styles.deleteBtn} 
        onClick={() => onDelete(bookId)}
        aria-label="Delete book"
      >
        🗑️
      </button>
    </div>
  );
}