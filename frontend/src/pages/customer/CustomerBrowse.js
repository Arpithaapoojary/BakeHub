import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MapPin, Star, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CustomerBrowse() {
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCity, setSelectedCity] = useState("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBakeries = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/bakeries/public"
        );
        setBakeries(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load bakeries");
      } finally {
        setLoading(false);
      }
    };

    fetchBakeries();
  }, []);

  // Unique city options
  const cityOptions = useMemo(() => {
    const cities = bakeries.map((b) => b.city).filter(Boolean);
    return ["all", ...Array.from(new Set(cities))];
  }, [bakeries]);

  // Filtered bakeries
  const filteredBakeries = useMemo(() => {
    return bakeries.filter((b) => {
      const matchCity =
        selectedCity === "all" ||
        (b.city && b.city.toLowerCase() === selectedCity.toLowerCase());

      const name = (b.name || "").toLowerCase();
      const searchText = search.toLowerCase();

      const matchSearch = !searchText || name.includes(searchText);

      return matchCity && matchSearch;
    });
  }, [bakeries, selectedCity, search]);

  // =================== STATES ===================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 text-lg animate-pulse">
        Loading bakeries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!bakeries.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <h2 className="text-2xl font-semibold">No bakeries available</h2>
        <p className="mt-2">Please check back later!</p>
      </div>
    );
  }

  // =================== PAGE ===================
  return (
    <div className="bg-[#FFF5FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER + FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="uppercase text-xs tracking-[0.2em] text-pink-500 font-semibold">
                Browse · Find nearby bakeries
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                Nearby Bakeries
              </h2>
              <p className="text-gray-600 mt-1">
                Filter bakeries by location and discover what’s freshly baked
                today.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {/* City filter */}
              <div className="flex items-center bg-white rounded-xl border border-pink-100 px-3 py-2 shadow-sm">
                <MapPin className="w-4 h-4 text-pink-500 mr-2" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent outline-none text-sm md:text-base text-gray-700"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city === "all" ? "All Locations" : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search box */}
              <div className="flex items-center bg-white rounded-xl border border-pink-100 px-3 py-2 shadow-sm w-full md:w-64">
                <Search className="w-4 h-4 text-pink-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search bakery name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm md:text-base w-full text-gray-700"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* NO MATCH AFTER FILTER */}
        {filteredBakeries.length === 0 && (
          <div className="mt-16 text-center text-gray-500">
            <p className="text-lg font-medium">
              No bakeries match your filters.
            </p>
            <p className="text-sm mt-1">
              Try changing location or search keyword.
            </p>
          </div>
        )}

        {/* BAKERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredBakeries.map((b, index) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-pink-100 overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/customer/menu/${b._id}`)}
            >
              {/* IMAGE */}
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                <img
                  src={
                    b.imageUrl ||
                    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                  }
                  alt={b.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                {/* City badge on image */}
                {b.city && (
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{b.city}</span>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5">
                {/* NAME */}
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                  {b.name}
                </h3>

                {/* ADDRESS */}
                <p className="text-gray-500 flex items-center gap-2 mt-1 text-sm line-clamp-1">
                  <MapPin size={14} />
                  {b.address || "No address available"}
                </p>

                {/* RATING (still placeholder) */}
                <div className="flex items-center gap-1 text-yellow-500 mt-3">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} />
                  <span className="text-gray-500 ml-1 text-xs">
                    (120 reviews)
                  </span>
                </div>

                {/* STATUS + CTA HINT */}
                <div className="flex items-center justify-between mt-4">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Approved Bakery
                  </span>
                  <span className="text-xs text-pink-600 font-medium">
                    Tap to view menu →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
