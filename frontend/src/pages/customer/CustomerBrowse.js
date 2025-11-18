import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";

export default function CustomerBrowse() {
  const [bakeries, setBakeries] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const navigate = useNavigate();

  // ---------------- LOAD BAKERIES ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bakeries");
        setBakeries(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // ---------------- FILTERING ----------------
  const filteredBakeries = bakeries.filter((b) => {
    const matchesName = b.name.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesLocation = b.address
      .toLowerCase()
      .includes(locationSearch.toLowerCase());
    return matchesName && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#FFF5FA] pb-16">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="text-center py-16 bg-gradient-to-br from-pink-400 to-pink-200 shadow-inner">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Discover Bakeries Near You 🍰
        </h1>
        <p className="mt-3 text-lg text-white opacity-90">
          Cakes • Cupcakes • Pastries • Desserts • Custom Orders
        </p>

        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="mt-10 flex justify-center">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-3xl shadow-xl w-[90%] md:w-[65%]">
            {/* LOCATION SEARCH */}
            <input
              type="text"
              placeholder="📍 Enter your city or area..."
              className="flex-1 px-5 py-3 rounded-xl bg-pink-50 outline-none text-gray-700 border border-pink-100"
              onChange={(e) => setLocationSearch(e.target.value)}
            />

            {/* NAME SEARCH */}
            <input
              type="text"
              placeholder="🔍 Search bakery..."
              className="flex-1 px-5 py-3 rounded-xl bg-pink-50 outline-none text-gray-700 border border-pink-100"
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ---------------- BAKERIES GRID ---------------- */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
        {filteredBakeries.length === 0 && (
          <p className="text-center text-gray-600 text-lg col-span-3">
            No bakeries match your search 😕
          </p>
        )}

        {filteredBakeries.map((b) => (
          <div
            key={b._id}
            onClick={() => navigate(`/customer/menu/${b._id}`)}
            className="cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-xl 
                       transition-all hover:-translate-y-2 border border-pink-100"
          >
            {/* ---------------- IMAGE ---------------- */}
            <div className="relative w-full h-48 rounded-t-3xl overflow-hidden">
              <img
                src={b.image || "https://i.imgur.com/sUFH1Aq.png"}
                alt={b.name}
                className="w-full h-full object-cover hover:scale-105 
                           transition duration-300"
              />

              {/* HEART BUTTON */}
              <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:bg-white transition">
                <Heart size={20} className="text-pink-600" />
              </button>
            </div>

            {/* ---------------- DETAILS ---------------- */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">{b.name}</h2>

              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <MapPin size={18} />
                <span>{b.address}</span>
              </div>

              {/* RATING */}
              <div className="mt-3 flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-semibold text-gray-700">4.6</span>
                <span className="text-gray-500 text-sm">(120 ratings)</span>
              </div>

              {/* ---------------- BUTTON ---------------- */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/customer/menu/${b._id}`);
                }}
                className="mt-5 w-full bg-pink-500 text-white py-2 rounded-xl 
                           hover:bg-pink-600 transition font-semibold"
              >
                View Menu →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
