import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

/* ===================== PROFESSIONAL LOGO ===================== */

const BakeHubLogo = () => (
  <div className="flex items-center gap-3">
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer tech circle */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="white"
        stroke="#ec4899"
        strokeWidth="6"
      />

      {/* Clean geometric B */}
      <path
        d="
        M35 25 
        H55 
        C68 25 75 32 75 40 
        C75 47 70 53 60 55 
        C72 58 78 63 78 72 
        C78 82 70 88 55 88 
        H35 
        Z"
        fill="#ec4899"
      />

      {/* Hub node */}
      <circle cx="70" cy="40" r="5" fill="#ec4899" />
    </svg>

    <span className="text-3xl font-extrabold tracking-tight text-white">
      BakeHub
    </span>
  </div>
);

/* ===================== HEADER COMPONENT ===================== */

export default function Header() {
  const [openProfile, setOpenProfile] = useState(false);

  const username = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // CART CONTEXT
  const { cart } = useCart();
  const cartCount = cart?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-pink-600 shadow-md py-4 px-6 flex justify-between items-center text-white sticky top-0 z-50">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <BakeHubLogo />
      </Link>

      {/* NAVIGATION */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="hover:text-pink-200 transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-pink-200 transition">
          About
        </Link>
        {role !== "admin" && (
          <Link to="/contact" className="hover:text-pink-200 transition">
            Contact
          </Link>
        )}

        {/* CUSTOMER NAVIGATION */}
        {token && role === "customer" && (
          <>
            <Link to="/customer" className="hover:text-pink-200 transition">
              Browse
            </Link>

            {/* MY ORDERS */}
            <Link to="/orders" className="hover:text-pink-200 transition">
              My Orders
            </Link>
          </>
        )}

        {/* OWNER NAVIGATION */}
        {token && role === "owner" && (
          <Link to="/owner" className="hover:text-pink-200 transition">
            Dashboard
          </Link>
        )}

        {/* ADMIN NAVIGATION */}
        {token && role === "admin" && (
          <Link to="/admin" className="hover:text-pink-200 transition">
            Admin Panel
          </Link>
        )}
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* CART ICON - CUSTOMER ONLY */}
        {token && role === "customer" && (
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart
              size={26}
              className="hover:text-pink-200 transition"
            />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
                {cartCount}
              </span>
            )}
          </div>
        )}

        {/* LOGIN BUTTON (BEFORE LOGIN) */}
        {!token && (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-white text-pink-600 rounded-xl font-semibold shadow hover:bg-pink-50 transition"
          >
            Login
          </button>
        )}

        {/* PROFILE DROPDOWN (AFTER LOGIN) */}
        {token && (
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl hover:bg-white/25 transition font-semibold"
            >
              <User size={18} />
              {username}
              <ChevronDown size={16} />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-100 z-50">
                {/* Profile */}
                <button
                  onClick={() => {
                    setOpenProfile(false);
                    if (role === "customer") navigate("/profile");
                    if (role === "owner") navigate("/owner/profile");
                    if (role === "admin") navigate("/admin/profile");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-pink-50 transition"
                >
                  My Profile
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    setOpenProfile(false);
                    if (role === "customer") navigate("/settings");
                    if (role === "owner") navigate("/owner/settings");
                    if (role === "admin") navigate("/admin/settings");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-pink-50 transition"
                >
                  Settings
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
