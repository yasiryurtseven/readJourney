import { useState, useEffect } from "react";
import { getRecommendedBooks } from "../../services/booksApi";
import BookModal from "../../components/BookModal/BookModal";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import styles from "./RecommendedPage.module.css";

export default function RecommendedPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Sayfalama ve Filtre state'leri
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Her sayfada 10 kitap
  
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  // Kitapları API'den çekme
  const fetchBooks = async (currentPage, currentLimit, filters) => {
    try {
      setLoading(true);
      const data = await getRecommendedBooks(currentPage, currentLimit, filters);
      
      // Backend yapısına göre (results/books dizisi ve toplam sayfa kontrolü)
      setBooks(data.results || data.books || data);
      if (data.totalPages) {
        setTotalPages(data.totalPages);
      } else if (data.totalDocs) {
        setTotalPages(Math.ceil(data.totalDocs / currentLimit));
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to load recommended books",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sayfa veya aktif filtreler değiştiğinde kitapları yeniden yükle
  useEffect(() => {
    fetchBooks(page, limit, activeFilters);
  }, [page, activeFilters]);

  // "To apply" butonuna basıldığında filtreleri uygula ve ilk sayfaya dön
  const handleApplyFilters = (e) => {
    e.preventDefault();
    const filters = {};
    if (titleFilter.trim()) filters.title = titleFilter.trim();
    if (authorFilter.trim()) filters.author = authorFilter.trim();
    
    setActiveFilters(filters);
    setPage(1); // Filtre değişince 1. sayfaya sıfırla
  };

  // Sol ok (<) butonuna basma
  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Sağ ok (>) butonuna basma
  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.recommendedPage}>
      {/* Sol Sütun: Filtreler ve Workout Paneli */}
      <aside className={styles.leftSidebar}>
        <form onSubmit={handleApplyFilters} className={styles.filtersCard}>
          <h3 className={styles.sectionTitle}>Filters:</h3>
          <div className={styles.filterGroup}>
            <label>Book title:</label>
            <input 
              type="text" 
              placeholder="Enter text" 
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className={styles.filterInput} 
            />
          </div>
          <div className={styles.filterGroup}>
            <label>The author:</label>
            <input 
              type="text" 
              placeholder="Enter text" 
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className={styles.filterInput} 
            />
          </div>
          <button type="submit" className={styles.applyBtn}>To apply</button>
        </form>

        <div className={styles.workoutCard}>
          <h3 className={styles.workoutTitle}>Start your workout</h3>
          <div className={styles.workoutSteps}>
            <div className={styles.workoutStep}>
              <span className={styles.stepNumber}>1</span>
              <p>Create a personal library: add the books you intend to read to it.</p>
            </div>
            <div className={styles.workoutStep}>
              <span className={styles.stepNumber}>2</span>
              <p>Create your first workout: define a goal, choose a period, start training.</p>
            </div>
          </div>
          <a href="/library" className={styles.workoutLink}>
            My library &rarr;
          </a>
        </div>

        <div className={styles.quoteCard}>
          <div className={styles.quoteIcon}>📚</div>
          <p className={styles.quoteText}>
            &quot;Books are windows to the world, and reading is a journey into the unknown.&quot;
          </p>
        </div>
      </aside>

      {/* Sağ Sütun: Önerilen Kitaplar ve Ok Tuşları ile Sayfalama */}
      <main className={styles.mainContentArea}>
        <div className={styles.booksSection}>
          <div className={styles.booksHeader}>
            <h2 className={styles.booksTitle}>Recommended</h2>
            <div className={styles.paginationButtons}>
              <button 
                className={styles.pageBtn} 
                onClick={handlePrevPage} 
                disabled={page <= 1 || loading}
              >
                &lt;
              </button>
              <button 
                className={styles.pageBtn} 
                onClick={handleNextPage} 
                disabled={page >= totalPages || loading}
              >
                &gt;
              </button>
            </div>
          </div>

          {loading ? (
            <p className={styles.loadingText}>Loading books...</p>
          ) : books.length === 0 ? (
            <p className={styles.loadingText}>No books found matching your criteria.</p>
          ) : (
            <div className={styles.booksGrid}>
              {books.map((book) => (
                <div 
                  key={book._id || book.id} 
                  className={styles.bookCard}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className={styles.coverWrapper}>
                    <img src={book.imageUrl || book.image} alt={book.title} className={styles.bookCover} />
                  </div>
                  <h4 className={styles.bookName}>{book.title}</h4>
                  <p className={styles.bookAuthor}>{book.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
}