import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Email validation
  const validateEmail = (value) => {
    setEmail(value);
    const pattern = /\S+@\S+\.\S+/;

    if (!pattern.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (emailError) {
      setError("Fix the errors before logging in");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role, name, user } = res.data;

      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (role === "admin") navigate("/admin");
      else if (role === "owner") navigate("/owner");
      else navigate("/customer");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50 to-slate-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg px-8 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Sign in to BakeHub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Login to your account to continue.
          </p>
        </div>

        {/* GENERAL ERROR MESSAGE */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              required
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          {/* PASSWORD + EYE ICON */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <div
                className="absolute right-3 top-2.5 cursor-pointer text-slate-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end text-xs">
            <Link
              to="/forgot-password"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full mt-2 bg-pink-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-700 transition shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-center text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register?role=owner"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Register Bakery
          </Link>
        </p>
      </div>
    </div>
  );
}
