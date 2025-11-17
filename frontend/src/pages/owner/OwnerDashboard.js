import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerDashboard() {
  const [bakery, setBakery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBakery = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bakeries/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBakery(res.data);
      } catch (err) {
        console.error(
          "Error fetching bakery:",
          err.response?.data || err.message
        );
        setError(
          err.response?.data?.message || "No bakery found for this account."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBakery();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p className="text-yellow-600 text-lg font-semibold animate-pulse">
          Loading your bakery...
        </p>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">{error}</h2>
          <p className="text-gray-600 mt-2">
            Please register your bakery or contact admin if already approved.
          </p>
        </div>
      </div>
    );
  }

  if (bakery.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p className="text-yellow-700 text-lg font-semibold">
          Waiting for admin approval 🕒
        </p>
      </div>
    );
  }

  // ✅ Main Dashboard Layout
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-10">
        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-yellow-200">
          <h1 className="text-4xl font-bold text-center text-yellow-600 mb-10">
            🧁 {bakery.name} Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                🍰 Menu Items
              </h2>
              <p className="text-gray-600">
                Manage your bakery’s products, update prices, or mark as sold
                out.
              </p>
              <button
                onClick={() => (window.location.href = "/owner/menu")}
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                View & Edit Menu
              </button>
            </div>

            {/* Orders */}
            <div className="bg-pink-50 p-6 rounded-xl shadow-md border border-pink-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                📦 Orders
              </h2>
              <p className="text-gray-600">
                View and update customer order statuses in real time.
              </p>
              <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition">
                View Orders
              </button>
            </div>

            {/* Analytics */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                📊 Analytics
              </h2>
              <p className="text-gray-600">
                Track your sales, order trends, and popular products.
              </p>
              <button
                onClick={() => (window.location.href = "/owner/analytics")}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
