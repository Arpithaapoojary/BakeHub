import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint =
        role === "customer" ? "/register-customer" : "/register-owner";

      await axios.post(`http://localhost:5000/api/auth${endpoint}`, {
        name,
        email,
        password,
      });

      alert("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          🍰 Create Your Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selector */}
          <div className="flex justify-between bg-pink-50 p-2 rounded-lg">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`w-1/2 py-2 rounded-lg ${
                role === "customer" ? "bg-pink-500 text-white" : "text-pink-600"
              }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`w-1/2 py-2 rounded-lg ${
                role === "owner" ? "bg-pink-500 text-white" : "text-pink-600"
              }`}
            >
              Bakery Owner
            </button>
          </div>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-pink-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
