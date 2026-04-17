import React, { useState } from "react";
import api from "../config/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
const navigate = useNavigate();
  // SEND OTP
  const handleSend = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/users/forgot-password", {
        email,
      });

      setServerOtp(data.otp); // 🔥 SHOW OTP
      toast.success("OTP generated (see below)");

      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // RESET
  



const handleReset = async (e) => {
  e.preventDefault();

  try {
    const { data } = await api.post("/api/users/reset-password", {
      email,
      otp,
      newPassword,
    });

    toast.success(data.message);

    // ✅ redirect to login page
    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-80">

        {step === 1 && (
          <form onSubmit={handleSend}>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="w-full bg-green-600 text-white py-2 rounded">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            <h2 className="text-xl font-bold mb-2">Enter OTP</h2>

            {/* 🔥 SHOW OTP */}
            <p className="text-sm text-gray-600 mb-2">
              Your OTP: <b>{serverOtp}</b>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button className="w-full bg-green-600 text-white py-2 rounded">
              Reset Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;