import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import api from "../config/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(
    urlState === "register" ? "register" : "login"
  );

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= LOGIN / REGISTER =================
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (state === "register") {
      payload.name = formData.name.trim();
    }

    const { data } = await api.post(`/api/users/${state}`, payload);

    dispatch(login(data));
    localStorage.setItem("token", data.token);

    toast.success(data.message);

    // ✅ REDIRECT AFTER LOGIN / REGISTER
    navigate("/app");

    setFormData({
      name: "",
      email: "",
      password: "",
    });

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

  // ✅ REDIRECT instead of calling API
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-96 w-full text-center bg-gray-900 border border-gray-800 rounded-2xl px-8"
      >
        <h1 className="text-white text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Please {state} to continue
        </p>

        {/* NAME */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-gray-800 border border-gray-700 h-12 rounded-full pl-6 gap-2">
            <User2Icon color="#6B7280" size={16} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="flex items-center w-full mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full pl-6 gap-2">
          <Mail color="#6B7280" size={14} />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center mt-4 w-full bg-gray-800 border border-gray-700 h-12 rounded-full pl-6 gap-2">
          <Lock color="#6B7280" size={14} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="mt-4 text-left">
          <button
  type="button"
  onClick={() => navigate("/forgot-password")}
  className="text-sm text-green-400 hover:underline"
>
  Forgot password?
</button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-green-600 hover:bg-green-500 transition"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-green-400 hover:underline ml-1">
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;