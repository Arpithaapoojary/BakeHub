import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User } from "lucide-react";

export default function Header() {
  const [openProfile, setOpenProfile] = useState(false);

  const username = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header
      className="bg-gradient-to-r from-pink-500 to-pink-600 shadow-md py-4 px-6 
      flex justify-between items-center text-white sticky top-0 z-50"
    >
      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        BakeHub
      </Link>

      {/* CENTER NAVIGATION LINKS */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="hover:text-pink-200 transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-pink-200 transition">
          About
        </Link>
        <Link to="/contact" className="hover:text-pink-200 transition">
          Contact
        </Link>

        {/* CUSTOMER ONLY → SHOW "Browse" */}
        {token && role === "customer" && (
          <Link to="/customer" className="hover:text-pink-200 transition">
            Browse
          </Link>
        )}

        {/* OWNER DASHBOARD */}
        {token && role === "owner" && (
          <Link
            to="/owner/dashboard"
            className="hover:text-pink-200 transition"
          >
            Dashboard
          </Link>
        )}

        {/* ADMIN PANEL */}
        {token && role === "admin" && (
          <Link
            to="/admin/dashboard"
            className="hover:text-pink-200 transition"
          >
            Admin Panel
          </Link>
        )}
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* BEFORE LOGIN → LOGIN BUTTON */}
        {!token && (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-white text-pink-600 rounded-xl font-semibold shadow 
            hover:bg-pink-50 transition"
          >
            Login
          </button>
        )}

        {/* AFTER LOGIN → PROFILE DROPDOWN */}
        {token && (
          <div className="relative">
            <button
              onClick={() => setOpenProfile((prev) => !prev)}
              className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl text-white 
              hover:bg-white/25 transition font-semibold"
            >
              <User size={18} />
              {username}
              <ChevronDown size={16} />
            </button>

            {/* DROPDOWN MENU */}
            {openProfile && (
              <div
                className="absolute right-0 mt-3 w-48 bg-white text-gray-800 shadow-xl 
                rounded-xl overflow-hidden border border-gray-100"
              >
                {/* My Profile */}
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
