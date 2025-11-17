import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setInfo(
        res.data.message || "If that email exists, a reset link will be sent."
      );
      // optionally navigate after a moment: navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error sending reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
          Forgot Password
        </h2>

        {info && <p className="text-green-600 mb-3">{info}</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your account email"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-pink-500 text-white py-2 rounded-lg">
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Back to{" "}
          <span
            className="text-pink-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
