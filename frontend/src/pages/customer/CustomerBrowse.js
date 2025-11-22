import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomerBrowse() {
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBakeries = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/bakeries/public"
        ); // ONLY approved bakeries
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

  // PAGE STATES
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 text-lg">
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* PAGE TITLE */}
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Nearby Bakeries</h2>

      {/* BAKERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {bakeries.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-200 overflow-hidden cursor-pointer"
            onClick={() => navigate(`/customer/menu/${b._id}`)}
          >
            {/* IMAGE */}
            <div className="h-48 bg-gray-100 overflow-hidden">
              <img
                src={
                  b.imageUrl ||
                  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                }
                alt={b.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {/* NAME */}
              <h3 className="text-2xl font-semibold text-gray-800">
                {b.name}
              </h3>

              {/* ADDRESS */}
              <p className="text-gray-500 flex items-center gap-2 mt-2">
                <MapPin size={16} />
                {b.address || "No address available"}
              </p>

              {/* RATING (STATIC PLACEHOLDER) */}
              <div className="flex items-center gap-1 text-yellow-500 mt-3">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} />
                <span className="text-gray-500 ml-1 text-sm">(120 reviews)</span>
              </div>

              {/* STATUS */}
              <span className="inline-block mt-4 px-3 py-1 text-sm rounded-full 
              bg-green-100 text-green-700">
                Approved
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
