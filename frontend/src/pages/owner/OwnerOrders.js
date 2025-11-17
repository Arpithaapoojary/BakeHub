import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/orders/owner-orders",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/orders/status/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-pink-600 mb-6">Bakery Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white p-5 shadow rounded-xl border border-pink-100"
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">Order #{o._id.slice(-5)}</h2>

                <span
                  className={`px-3 py-1 rounded-lg text-white ${
                    o.status === "pending"
                      ? "bg-yellow-500"
                      : o.status === "confirmed"
                      ? "bg-blue-500"
                      : "bg-green-600"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              {/* Items */}
              <div className="mt-3 text-gray-700">
                {o.items.map((i, index) => (
                  <div key={index}>
                    {i.name} × {i.qty} — ₹{i.price * i.qty}
                  </div>
                ))}
              </div>

              <div className="mt-3 font-bold text-pink-600">
                Total: ₹{o.total}
              </div>

              {/* Status Update Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(o._id, "confirmed")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(o._id, "completed")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
