import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Store, User, LogOut, ChevronDown } from "lucide-react";

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm ${
    isActive
      ? "bg-white/80 text-pink-700 shadow-sm font-semibold"
      : "text-white/90 hover:bg-white/10 transition"
  }`;

export default function Navbar() {
  const navigate = useNavigate();

  // Read from localStorage (same as your working header)
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const isLoggedIn = !!role;
  const username = name ? name.split(" ")[0] : "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Dropdown state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resolve "My Profile" route based on role
  const handleProfileClick = () => {
    if (role === "owner") navigate("/owner");
    else if (role === "admin") navigate("/admin");
    else navigate("/customer");
    setOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white">
          <Store className="w-6 h-6" />
          <span className="font-bold tracking-wide text-lg">BakeHub</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Always visible */}
          <NavLink to="/customer" className={linkCls}>
            Browse
          </NavLink>

          {/* CUSTOMER */}
          {role === "customer" && (
            <NavLink to="/orders" className={linkCls}>
              My Orders
            </NavLink>
          )}

          {/* OWNER */}
          {role === "owner" && (
            <>
              <NavLink to="/owner" className={linkCls}>
                Dashboard
              </NavLink>
              <NavLink to="/owner/products" className={linkCls}>
                My Bakery
              </NavLink>
            </>
          )}

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <NavLink to="/admin" className={linkCls}>
                Admin
              </NavLink>
              <NavLink to="/admin/bakeries" className={linkCls}>
                Manage
              </NavLink>
            </>
          )}

          {/* Register Bakery – only when not logged in */}
          {!isLoggedIn && (
            <NavLink to="/register?role=owner" className={linkCls}>
              Register Bakery
            </NavLink>
          )}

          {/* PROFILE AREA */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* Button with avatar + name */}
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/20 transition"
              >
                {/* Avatar circle */}
                <div className="w-7 h-7 bg-white text-pink-600 font-bold flex items-center justify-center rounded-full">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span>{username}</span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-pink-100 py-2 text-sm z-50">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
                  >
                    Settings
                  </button>
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
            <NavLink to="/login" className={linkCls}>
              <User className="inline w-4 h-4 mr-1" />
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
