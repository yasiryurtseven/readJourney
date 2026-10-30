import { instance } from "./axios";

// Önerilen kitapları listeleme ve filtreleme (title ve author parametreleri ile)
// Sayfa ve limit parametreleri alabilen Recommended API fonksiyonu
export const getRecommendedBooks = async (page = 1, limit = 8, filters = {}) => {
  const params = { page, limit, ...filters };
  const response = await instance.get("/books/recommend", { params });
  return response.data;
};

// Kitabı kütüphaneye ekleme
export const addBookToLibrary = async (bookId) => {
  const response = await instance.post(`/books/add/${bookId}`);
  return response.data;
};
// Kullanıcının kütüphanesindeki kitapları getir
export const getOwnBooks = async () => {
  const response = await instance.get("/books/own");
  return response.data;
};

// Kütüphaneden kitap sil
export const removeBookFromLibrary = async (bookId) => {
  const response = await instance.delete(`/books/remove/${bookId}`);
  return response.data;
};
// Okuma seansı başlat (Start workout)
export const startWorkout = async ({ id, page }) => {
  const response = await instance.post("/books/reading/start", { id, page });
  return response.data;
};

// Okunan sayfa miktarını kaydet / Sayfa ilerlemesi ekle (Add reading result)
export const addReadingPages = async (data) => {
  // data: { id: bookId, pages: number } veya ilgili endpoint yapısı
  const response = await instance.post("/books/reading", data);
  return response.data;
};

// Okuma seansını sonlandır / durdur (Stop workout)
export const stopWorkout = async (bookId) => {
  const response = await instance.delete(`/books/stop/${bookId}`);
  return response.data;
};
