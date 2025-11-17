import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Store, User, LogOut } from "lucide-react";

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm ${
    isActive
      ? "bg-white/70 text-brand-700 shadow-sm"
      : "text-white/90 hover:bg-white/10"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Store className="w-6 h-6" />
          <span className="font-bold tracking-wide">BakeHub</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <NavLink to="/customer" className={linkCls}>
            Browse
          </NavLink>
          {user?.role === "owner" && (
            <NavLink to="/owner" className={linkCls}>
              Owner
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkCls}>
              Admin
            </NavLink>
          )}
          {!user ? (
            <NavLink to="/auth" className={linkCls}>
              <User className="inline w-4 h-4 mr-1" />
              Login
            </NavLink>
          ) : (
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10"
            >
              <LogOut className="inline w-4 h-4 mr-1" />
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
