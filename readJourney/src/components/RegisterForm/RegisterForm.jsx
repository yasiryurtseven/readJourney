import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { registerUser } from "../../services/authApi";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
}).required();

export default function RegisterForm() {
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
      const response = await registerUser(data);
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Backend'den gelen kullanıcı adını kaydedelim (Garantili yapı)
        const nameToSave = response.user?.name || response.name || data.name;
        localStorage.setItem("userName", nameToSave);

        iziToast.success({ title: "Success", message: "Registration successful!" });
        navigate("/recommended");
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Registration failed!",
      });
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input type="text" {...register("name")} />
          <p style={{ color: "red" }}>{errors.name?.message}</p>
        </div>

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

        <button type="submit">Registration</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}