import { instance } from "./axios";

// Kullanıcı kayıt isteği (/users/signup)
export const registerUser = async (userData) => {
  const response = await instance.post("/users/signup", userData);
  return response.data;
};

// Kullanıcı giriş isteği (/users/signin)
export const loginUser = async (userData) => {
  const response = await instance.post("/users/signin", userData);
  return response.data;
};

// Oturum sonlandırma isteği (/users/signout)
export const logoutUser = async () => {
  const response = await instance.post("/users/signout");
  return response.data;
};