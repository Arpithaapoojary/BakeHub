import React, { useState } from "react";
import { Camera, User, Mail, Phone, Save } from "lucide-react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [photo, setPhoto] = useState(user.photo || "");

  const handleSave = () => {
    const updated = { ...user, name, email, phone, photo };
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-pink-50 px-6 py-10 flex justify-center">
      <div className="max-w-2xl w-full bg-white/60 backdrop-blur-xl border border-pink-200 shadow-2xl rounded-3xl p-10 animate-fadeIn">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-pink-700 mb-8 text-center">
          My Profile
        </h1>

        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={
                photo || "https://cdn-icons-png.flaticon.com/512/219/219983.png"
              }
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
            />

            <label className="absolute bottom-2 right-2 bg-pink-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-pink-700 transition">
              <Camera size={20} />
              <input
                type="file"
                onChange={(e) =>
                  setPhoto(URL.createObjectURL(e.target.files[0]))
                }
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <User size={18} /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-pink-200 bg-white/70 outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <Mail size={18} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-pink-200 bg-white/70 outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <Phone size={18} /> Phone Number
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-pink-200 bg-white/70 outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-10 w-full py-3 rounded-xl bg-pink-600 text-white text-lg font-semibold shadow-lg hover:bg-pink-700 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={22} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
