import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Analytics() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/analytics/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) return <p className="p-10 text-center">Loading analytics...</p>;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">
        📊 Bakery Analytics Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border border-pink-100">
          <h2 className="text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold text-pink-600">{data.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-pink-100">
          <h2 className="text-gray-600">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">
            ₹{data.totalRevenue}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-pink-100">
          <h2 className="text-gray-600">Top Item</h2>
          <p className="text-2xl font-semibold text-pink-500">
            {data.topItems[0]?.name || "N/A"}
          </p>
        </div>
      </div>

      {/* TOP SELLING ITEMS */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border border-pink-100">
        <h3 className="text-xl font-bold mb-4 text-pink-600">🔥 Top Selling Items</h3>

        {data.topItems.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.topItems.map((item, i) => (
              <li key={i} className="flex justify-between border-b py-2">
                <span>{item.name}</span>
                <strong>{item.qty} sold</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-6 rounded-xl shadow border border-pink-100">
        <h3 className="text-xl font-bold mb-4 text-pink-600">🧾 Recent Orders</h3>

        {data.recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders.</p>
        ) : (
          <ul className="space-y-4">
            {data.recentOrders.map((o) => (
              <li
                key={o._id}
                className="border-b pb-2 flex justify-between text-gray-700"
              >
                <span>Order #{o._id.slice(-5)}</span>
                <span className="font-semibold">₹{o.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
