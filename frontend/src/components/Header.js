import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const username = name ? name.split(" ")[0] : "User";

  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProfile = () => {
    if (role === "owner") navigate("/owner");
    else if (role === "admin") navigate("/admin");
    else navigate("/customer");
    setOpenProfile(false);
  };

  return (
    <>
      {/* HEADER */}
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

          {/* DESKTOP NAV */}
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

            {role === "owner" && (
              <>
                <button
                  onClick={() => navigate("/owner")}
                  className="hover:text-pink-600"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/owner/products")}
                  className="hover:text-pink-600"
                >
                  My Bakery
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <button
                  onClick={() => navigate("/admin")}
                  className="hover:text-pink-600"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => navigate("/admin/bakeries")}
                  className="hover:text-pink-600"
                >
                  Manage Bakeries
                </button>
              </>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* CUSTOMER CART */}
            {role === "customer" && (
              <div
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer text-pink-600 hover:text-pink-700
                bg-white/80 p-2 rounded-full shadow-md transition"
              >
                <ShoppingBag size={25} />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-pink-600 text-white px-2 py-[1px] rounded-full shadow-md">
                    {cart.length}
                  </span>
                )}
              </div>
            )}

            {/* PROFILE DROPDOWN */}
            {role ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur rounded-full shadow-sm"
                >
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>

                  <span className="font-medium text-gray-800">{username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-2 z-50">
                    <button
                      onClick={goToProfile}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50"
                    >
                      My Profile
                    </button>

                    {role === "customer" && (
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setOpenProfile(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50"
                      >
                        My Orders
                      </button>
                    )}

                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50"
                    >
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:flex bg-pink-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-pink-700 transition gap-2 items-center font-medium"
              >
                <User size={20} /> Login
              </button>
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

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 p-6 transform 
        transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
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

          {!role ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-pink-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-pink-700 transition mt-4 flex items-center gap-2"
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
