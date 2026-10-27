import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { loginUser } from "../../services/authApi";

// Şartnameye uygun Login validasyon şeması
const schema = yup.object({
  email: yup
    .string()
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
}).required();

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Giriş yanıtından kullanıcı adını alalım
        const nameToSave = response.user?.name || response.name || "User";
        localStorage.setItem("userName", nameToSave);

        iziToast.success({ title: "Success", message: "Login successful!" });
        navigate("/recommended");
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Login failed!",
      });
    }
  };
  return (
    <div className="login-form-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input type="email" {...register("email")} />
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        </div>

        <button type="submit">Log In</button>
      </form>

      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}