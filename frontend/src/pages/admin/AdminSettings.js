import React, { useState } from "react";
import { User, Phone, Lock } from "lucide-react";

export default function AdminSettings() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  const updateProfile = async () => {
    if (!name || !phone) return alert("Fields cannot be empty");

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      localStorage.setItem("name", name);
      localStorage.setItem("phone", phone);

      alert("Profile updated!");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const updatePassword = async () => {
    if (!password.trim()) return alert("New password required");

    const oldPassword = prompt("Enter old password:");
    if (!oldPassword) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword: password }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Password updated!");
      setPassword("");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Admin Settings
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 space-y-12">
          {/* NAME */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <User size={22} className="text-gray-600" />
              Name
            </h2>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </section>

          {/* PHONE */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Phone size={22} className="text-gray-600" />
              Phone Number
            </h2>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </section>

          <button
            onClick={updateProfile}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Save Profile
          </button>

          {/* PASSWORD */}
          <section className="pt-10 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Lock size={22} className="text-gray-600" />
              Change Password
            </h2>

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={updatePassword}
              className="mt-4 px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-900 transition"
            >
              Update Password
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
