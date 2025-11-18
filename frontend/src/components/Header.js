import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Menu,
  User,
  ShoppingBag,
  LogOut,
  X,
  Home,
  Search,
  Info,
  Phone,
} from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      {/* ---------------- HEADER ---------------- */}
      <header className="sticky top-0 z-50 shadow-md bg-white/90 backdrop-blur-lg border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/706/706195.png"
              alt="BakeHub Logo"
              className="w-11 h-11 rounded-xl shadow-sm"
            />
            <h1 className="text-3xl font-bold text-pink-600 tracking-wide">
              BakeHub
            </h1>
          </div>

          {/* NAV (Desktop) */}
          <nav className="hidden md:flex items-center gap-10 text-gray-700 font-semibold">
            <Link to="/" className="hover:text-pink-600 transition">
              Home
            </Link>
            <Link to="/customer" className="hover:text-pink-600 transition">
              Browse
            </Link>
            <Link to="/about" className="hover:text-pink-600 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-pink-600 transition">
              Contact
            </Link>

            {role === "customer" && (
              <button
                onClick={() => navigate("/orders")}
                className="hover:text-pink-600 transition"
              >
                My Orders
              </button>
            )}

            {role === "owner" && (
              <button
                onClick={() => navigate("/owner")}
                className="hover:text-pink-600 transition"
              >
                Owner Dashboard
              </button>
            )}

            {role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="hover:text-pink-600 transition"
              >
                Admin Panel
              </button>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-6">
            {/* PREMIUM CART */}
            {role === "customer" && (
              <div
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer text-pink-600 hover:text-pink-700 transition
                          bg-white/80 backdrop-blur-xl p-2 rounded-full 
                          shadow-[0_4px_12px_rgba(255,105,180,0.25)]
                          hover:shadow-[0_6px_20px_rgba(255,105,180,0.35)]
                          active:scale-95 duration-200"
              >
                <ShoppingBag size={25} />

                {cart.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 text-[10px] font-bold
                                   bg-gradient-to-br from-pink-500 to-pink-700 
                                   text-white px-2 py-[2px] rounded-full shadow-md"
                  >
                    {cart.length}
                  </span>
                )}
              </div>
            )}

            {/* LOGIN / LOGOUT BUTTON (Desktop) */}
            {!role ? (
              <button
                onClick={() => navigate("/")}
                className="hidden md:flex bg-pink-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-pink-700 transition gap-2 items-center font-medium"
              >
                <User size={20} /> Login
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur shadow-sm rounded-full">
                <span className="text-gray-700 font-medium">
                  {name?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-pink-600 hover:text-pink-700 transition flex items-center gap-1 font-medium"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            )}

            {/* MOBILE MENU ICON */}
            <button
              className="md:hidden block text-pink-600"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={30} />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MOBILE MENU OVERLAY ---------------- */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* ---------------- MOBILE SLIDE MENU ---------------- */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 p-6 transform 
        transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-pink-600"
          onClick={() => setMenuOpen(false)}
        >
          <X size={28} />
        </button>

        <h2 className="text-2xl font-bold text-pink-600 mb-6">Menu</h2>

        <div className="flex flex-col gap-6 text-lg text-gray-700 font-semibold">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-pink-600"
          >
            <Home size={20} /> Home
          </Link>

          <Link
            to="/customer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-pink-600"
          >
            <Search size={20} /> Browse
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-pink-600"
          >
            <Info size={20} /> About
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-pink-600"
          >
            <Phone size={20} /> Contact
          </Link>

          {role === "customer" && (
            <button
              onClick={() => {
                navigate("/orders");
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 hover:text-pink-600"
            >
              My Orders
            </button>
          )}

          {role === "owner" && (
            <button
              onClick={() => {
                navigate("/owner");
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 hover:text-pink-600"
            >
              Owner Dashboard
            </button>
          )}

          {role === "admin" && (
            <button
              onClick={() => {
                navigate("/admin");
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 hover:text-pink-600"
            >
              Admin Panel
            </button>
          )}

          {/* LOGIN / LOGOUT */}
          {!role ? (
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="bg-pink-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-pink-700 transition mt-4 flex items-center gap-2 font-medium"
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
