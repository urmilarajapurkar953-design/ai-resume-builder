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

  // Define your border color here (as requested in your snippet)
  const borderColor = "#374151"; // This is a dark gray tailwind-like color

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
      navigate("/app");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-96 w-full text-left bg-gray-900 border border-gray-800 rounded-2xl p-8"
      >
        <h1 className="text-white text-3xl font-medium text-center">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2 mb-8 text-center">
          Please {state} to continue
        </p>

        {/* NAME FIELD */}
        {state !== "login" && (
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-1 ml-1">Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 transition-colors"
                style={{ border: `1px solid ${borderColor}` }}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* EMAIL FIELD */}
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-1 ml-1">Email ID</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 transition-colors"
            style={{ border: `1px solid ${borderColor}` }}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD FIELD */}
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-1 ml-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 transition-colors"
            style={{ border: `1px solid ${borderColor}` }}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-green-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-500 transition shadow-lg"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() => setState((prev) => (prev === "login" ? "register" : "login"))}
          className="text-gray-400 text-sm mt-6 text-center cursor-pointer"
        >
          {state === "login" ? "Don't have an account?" : "Already have an account?"}
          <span className="text-green-400 hover:underline ml-1 font-medium">
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;