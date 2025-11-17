import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerBrowse() {
  const [bakeries, setBakeries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("http://localhost:5000/api/bakeries");
      setBakeries(res.data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5FA]">
      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-br from-pink-300 to-pink-100 shadow-inner">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Find the Perfect Bakery Near You 🍰
        </h1>
        <p className="mt-3 text-lg text-white opacity-90">
          Cakes • Pastries • Cupcakes • Desserts — Fresh & Made with Love 💗
        </p>
      </div>

      {/* Bakeries Listing */}
      <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
        {bakeries.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-3xl shadow-xl border border-pink-100 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition p-6"
            onClick={() => navigate(`/customer/menu/${b._id}`)}
          >
            <div className="w-full h-40 bg-pink-200 rounded-2xl mb-4"></div>

            <h2 className="text-2xl font-bold text-gray-800">{b.name}</h2>
            <p className="text-gray-600 mt-2">{b.address}</p>

            <button
              className="mt-5 w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customer/menu/${b._id}`);
              }}
            >
              View Menu →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
