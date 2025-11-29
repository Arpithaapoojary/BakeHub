import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import {
  Store,
  User,
  LogOut,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const username = name ? name.split(" ")[0] : "User";
  const isLoggedIn = !!role;

  const [openProfile, setOpenProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm tracking-wide ${
      isActive
        ? "bg-white/90 text-pink-700 shadow font-semibold"
        : "text-white/90 hover:bg-white/20 transition"
    }`;

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-5">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <Store size={28} strokeWidth={1.5} />
            <span className="font-bold tracking-wide text-xl">BakeHub</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/customer" className={navLinkClass}>
              Browse
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {/* CUSTOMER LINK */}
            {role === "customer" && (
              <NavLink to="/orders" className={navLinkClass}>
                My Orders
              </NavLink>
            )}

            {/* OWNER LINK */}
            {role === "owner" && (
              <NavLink to="/owner" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}

            {/* ADMIN LINK */}
            {role === "admin" && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin Panel
              </NavLink>
            )}

            {/* CART (Customers only) */}
            {role === "customer" && (
              <div
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer text-white hover:text-white/90"
              >
                <ShoppingBag size={25} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-white text-pink-600 px-2 py-[1px] rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            )}

            {/* PROFILE DROPDOWN */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition"
                >
                  <div className="w-8 h-8 bg-white text-pink-700 rounded-full flex items-center justify-center font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{username}</span>
                  <ChevronDown size={16} />
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-100 py-2 text-sm z-50">
                    {/* Profile */}
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50"
                    >
                      My Profile
                    </button>

                    {/* SETTINGS — ROLE-BASED */}
                    <button
                      onClick={() => {
                        if (role === "owner") navigate("/owner/settings");
                        else if (role === "admin") navigate("/admin/settings");
                        else navigate("/settings");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
                    >
                      Settings
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                <User size={16} /> Login
              </NavLink>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden ml-auto text-white"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={30} />
          </button>
        </nav>
      </header>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 p-6 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-pink-600"
          onClick={() => setMenuOpen(false)}
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-bold text-pink-600 mb-6">Menu</h2>

        <div className="flex flex-col gap-6 text-lg font-semibold text-gray-700">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/customer" onClick={() => setMenuOpen(false)}>
            Browse
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          {role === "customer" && (
            <Link to="/orders" onClick={() => setMenuOpen(false)}>
              My Orders
            </Link>
          )}

          {role === "owner" && (
            <Link to="/owner" onClick={() => setMenuOpen(false)}>
              Owner Dashboard
            </Link>
          )}

          {role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Admin Panel
            </Link>
          )}

          {/* Settings – mobile */}
          <Link
            onClick={() => {
              if (role === "owner") navigate("/owner/settings");
              else if (role === "admin") navigate("/admin/settings");
              else navigate("/settings");
              setMenuOpen(false);
            }}
          >
            Settings
          </Link>

          {/* LOGIN / LOGOUT */}
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-pink-600 text-white px-5 py-2 rounded-full shadow-md mt-4 hover:bg-pink-700 flex items-center gap-2"
            >
              <User size={20} /> Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex mt-4 items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
            >
              <LogOut size={22} /> Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
