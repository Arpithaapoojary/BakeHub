import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect role from URL (customer / owner / admin)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");

    if (r === "customer" || r === "owner" || r === "admin") {
      setRole(r);
    } else {
      setRole("customer");
    }
  }, [location]);

  // Validate Email Format
  const handleEmail = (value) => {
    setEmail(value);

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Validate Password (Min 6 chars)
  const handlePassword = (value) => {
    setPassword(value);

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (emailError || passwordError) {
      setError("Fix all errors before submitting");
      return;
    }

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      // Save login info
      localStorage.clear();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirects
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner") {
        if (res.data.bakeryStatus === "approved") {
          navigate("/owner");
        } else {
          navigate("/owner/pending");
        }
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50 to-slate-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border rounded-2xl shadow-lg px-8 py-10">
        {/* TITLE */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Login as {role.toUpperCase()}
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        {/* ERROR BOX */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 text-sm"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              required
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 text-sm"
                value={password}
                onChange={(e) => handlePassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {passwordError && (
              <p className="text-xs text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        {role !== "admin" && (
          <p className="text-xs text-center text-slate-500 mt-6">
            Don’t have an account?{" "}
            <Link
              to={`/register?role=${role}`}
              className="text-pink-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
