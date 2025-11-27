import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("owner"); // always owner
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  // validation states
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-select owner if coming from ?role=owner
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "owner") setRole("owner");
  }, [location]);

  // Validate email format
  const validateEmail = (value) => {
    setEmail(value);
    const pattern = /\S+@\S+\.\S+/;
    if (!pattern.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Validate name
  const validateName = (value) => {
    setName(value);
    if (value.length < 3) {
      setNameError("Name must be at least 3 characters");
    } else {
      setNameError("");
    }
  };

  // Check password strength
  const checkStrength = (value) => {
    setPassword(value);

    if (value.length < 6) {
      setPasswordStrength("weak");
    } else if (value.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (emailError || nameError) {
      setError("Fix the errors before submitting");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register-owner", {
        name,
        email,
        password,
      });

      alert("Registered successfully. Wait for admin approval.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  // Password strength color class
  const strengthColor =
    passwordStrength === "weak"
      ? "text-red-600"
      : passwordStrength === "medium"
      ? "text-yellow-600"
      : passwordStrength === "strong"
      ? "text-green-600"
      : "text-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50 to-slate-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg px-8 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Register Your Bakery
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create a bakery owner account to manage your bakery.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="hidden" value={role} />

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Owner Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
              value={name}
              onChange={(e) => validateName(e.target.value)}
              required
            />
            {nameError && (
              <p className="text-xs text-red-600 mt-1">{nameError}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Owner Email
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

          {/* PASSWORD + EYE ICON + STRENGTH */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                value={password}
                onChange={(e) => checkStrength(e.target.value)}
                required
              />

              {/* EYE ICON */}
              <div
                className="absolute right-3 top-2.5 cursor-pointer text-slate-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* PASSWORD STRENGTH */}
            {password && (
              <p className={`text-xs mt-1 font-medium ${strengthColor}`}>
                {passwordStrength === "weak" && "Weak password"}
                {passwordStrength === "medium" && "Medium strength password"}
                {passwordStrength === "strong" && "Strong password"}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full mt-2 bg-pink-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-700 transition shadow-sm"
          >
            Register Bakery Owner
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
