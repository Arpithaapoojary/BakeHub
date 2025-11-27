import React, { useState } from "react";
import { Lock, Bell, Trash2, Shield } from "lucide-react";

export default function Settings() {
  const [notify, setNotify] = useState(true);
  const [password, setPassword] = useState("");

  const updatePassword = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    alert("Password updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-pink-50 px-6 py-10 flex justify-center">
      <div className="max-w-2xl w-full bg-white/60 backdrop-blur-xl border border-pink-200 shadow-2xl rounded-3xl p-10 animate-fadeIn">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-pink-700 mb-8 text-center">
          Settings
        </h1>

        {/* Notifications */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-pink-100 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 mb-4">
            <Bell size={20} />
            Notifications
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notify}
              onChange={() => setNotify(!notify)}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Enable order status updates</span>
          </label>
        </div>

        {/* Change Password */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-pink-100 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 mb-4">
            <Lock size={20} />
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-pink-200 bg-white/70 outline-none focus:ring-2 focus:ring-pink-300"
          />

          <button
            onClick={updatePassword}
            className="mt-3 px-5 py-2 rounded-xl bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition active:scale-95"
          >
            Update Password
          </button>
        </div>

        {/* Delete Account */}
        <div className="bg-red-100/80 p-6 rounded-2xl shadow-md border border-red-200">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-red-700 mb-4">
            <Trash2 size={20} />
            Delete Account
          </h2>

          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete your account?")
              ) {
                alert("Account deleted!");
              }
            }}
            className="bg-red-600 text-white px-5 py-2 rounded-xl shadow hover:bg-red-700 transition active:scale-95"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
