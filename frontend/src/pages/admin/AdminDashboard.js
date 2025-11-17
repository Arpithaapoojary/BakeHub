import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBakeries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bakeries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBakeries(res.data);
      } catch (err) {
        console.error("Error fetching bakeries", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBakeries();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bakeries/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBakeries((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      console.error("Error approving bakery", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-pink-600 font-semibold text-lg animate-pulse">
          Loading bakeries...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-pink-200">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-10">
          👑 BakeHub Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bakeries.map((b) => (
            <div
              key={b._id}
              className="bg-pink-50 rounded-2xl p-6 shadow-md border border-pink-100 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {b.name}
              </h2>
              <p className="text-gray-600 mb-3">
                📍 {b.address || "No address provided"}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  b.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {b.status}
              </span>
              {b.status !== "approved" && (
                <button
                  onClick={() => handleApprove(b._id)}
                  className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                >
                  Approve Bakery
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
