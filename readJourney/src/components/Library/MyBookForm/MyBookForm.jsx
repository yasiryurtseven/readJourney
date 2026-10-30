import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./MyBookForm.module.css";

// Form doğrulama şeması (Yup)
const schema = yup.object().shape({
  title: yup.string().required("Book title is required"),
  author: yup.string().required("Author is required"),
  totalPages: yup
    .number()
    .typeError("Pages must be a number")
    .positive("Pages must be greater than 0")
    .required("Number of pages is required"),
});

export default function MyBookForm({ onAddBook }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    onAddBook(data);
    reset(); // Formu başarıyla gönderdikten sonra temizle
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <h3 className={styles.formTitle}>Add book:</h3>

      <div className={styles.inputGroup}>
        <label>Book title:</label>
        <input 
          type="text" 
          placeholder="Enter text" 
          {...register("title")} 
          className={styles.inputField} 
        />
        {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label>The author:</label>
        <input 
          type="text" 
          placeholder="Enter text" 
          {...register("author")} 
          className={styles.inputField} 
        />
        {errors.author && <span className={styles.errorText}>{errors.author.message}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label>Number of pages:</label>
        <input 
          type="number" 
          placeholder="Enter pages" 
          {...register("totalPages")} 
          className={styles.inputField} 
        />
        {errors.totalPages && <span className={styles.errorText}>{errors.totalPages.message}</span>}
      </div>

      <button type="submit" className={styles.submitBtn}>
        Add to library
      </button>
    </form>
  );
}