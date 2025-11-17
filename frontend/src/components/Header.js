import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/customer"
          className="text-3xl font-bold text-pink-600 flex items-center gap-2"
        >
          🎀 <span className="text-gray-800">Bake</span>Hub
        </Link>

        {/* Navigation */}
        <nav className="flex gap-8 text-gray-700 font-medium">
          <Link to="/customer" className="hover:text-pink-600">
            Home
          </Link>

          <Link to="/customer" className="hover:text-pink-600">
            Browse
          </Link>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          {/* Customer-Only: My Orders */}
          {role === "customer" && (
            <button
              onClick={() => navigate("/orders")}
              className="hover:text-pink-600"
            >
              My Orders
            </button>
          )}

          {/* Owner Dashboard Link */}
          {role === "owner" && (
            <button
              onClick={() => navigate("/owner")}
              className="hover:text-pink-600"
            >
              Owner Dashboard
            </button>
          )}

          {/* Admin Dashboard */}
          {role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="hover:text-pink-600"
            >
              Admin
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Cart (Only for Customer) */}
          {role === "customer" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative text-pink-600 text-lg font-semibold"
            >
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white rounded-full px-2 text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          )}

          {/* If logged in → Show user + logout */}
          {role ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">
                Hi, {name?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            // If not logged in → Show login
            <button
              onClick={() => navigate("/")}
              className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
