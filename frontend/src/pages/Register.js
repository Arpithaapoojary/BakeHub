import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");

  // Common Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Owner-Only Fields
  const [bakeryName, setBakeryName] = useState("");
  const [address, setAddress] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Detect role from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "customer" || r === "owner") {
      setRole(r);
    }
  }, [location]);

  // ==================== VALIDATION ====================
  const validateFields = () => {
    let temp = {};

    // Name
    if (!name.trim()) temp.name = "Full name is required";

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) temp.email = "Email is required";
    else if (!emailPattern.test(email)) temp.email = "Enter a valid email";

    // Phone
    if (!phone.trim()) temp.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone))
      temp.phone = "Enter a valid 10-digit phone number";

    // Password
    if (!password.trim()) temp.password = "Password is required";
    else if (password.length < 6)
      temp.password = "Password must be at least 6 characters";

    // Owner-specific
    if (role === "owner") {
      if (!bakeryName.trim()) temp.bakeryName = "Bakery name is required";
      if (!address.trim()) temp.address = "Address is required";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ==================== SUBMIT HANDLER ====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateFields()) return;

    try {
      setLoading(true);

      const payload =
        role === "customer"
          ? { name, email, phone, password }
          : { name, email, phone, password, bakeryName, address };

      const endpoint =
        role === "customer"
          ? "http://localhost:5000/api/auth/register-customer"
          : "http://localhost:5000/api/auth/register-owner";

      await axios.post(endpoint, payload);

      // Redirect after success
      navigate(`/login?role=${role}`);
    } catch (err) {
      setGeneralError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50 to-slate-100">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm border rounded-2xl shadow-lg px-8 py-10">
        {/* TITLE */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Register as {role === "customer" ? "Customer" : "Bakery Owner"}
          </h1>
          <p className="text-sm text-slate-500">
            Please fill in your details below.
          </p>
        </div>

        {/* GENERAL ERROR */}
        {generalError && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {generalError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* OWNER-ONLY FIELDS */}
          {role === "owner" && (
            <>
              {/* Bakery Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Bakery Name
                </label>
                <input
                  type="text"
                  placeholder="Sweet Treats Bakery"
                  value={bakeryName}
                  onChange={(e) => setBakeryName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
                />
                {errors.bakeryName && (
                  <p className="text-xs text-red-600">{errors.bakeryName}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Bakery Address
                </label>
                <textarea
                  placeholder="Full bakery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-xs text-red-600">{errors.address}</p>
                )}
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate(`/login?role=${role}`)}
            className="text-pink-600 font-medium hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
