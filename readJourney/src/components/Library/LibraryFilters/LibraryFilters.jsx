import styles from "./LibraryFilters.module.css";

export default function LibraryFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { key: "all", label: "All books" },
    { key: "to-read", label: "To read" },
    { key: "in-progress", label: "In progress" },
    { key: "done", label: "Done" },
  ];

  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.filterTitle}>Filters:</h3>
      <div className={styles.filterTabs}>
        {filters.map((f) => (
          <button
            key={f.key}
            className={`${styles.tabBtn} ${activeFilter === f.key ? styles.activeTab : ""}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}