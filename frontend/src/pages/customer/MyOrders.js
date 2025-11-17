import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-pink-600 font-semibold text-xl">
        Loading your orders…
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center py-20 text-gray-600 text-xl">
        You haven't placed any orders yet.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md p-6 border border-pink-100"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Order #{order._id.slice(-6)}
              </h2>

              <span
                className={`px-4 py-1 rounded-full text-white text-sm ${
                  order.status === "pending"
                    ? "bg-yellow-500"
                    : order.status === "confirmed"
                    ? "bg-blue-500"
                    : "bg-green-600"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-gray-700 border-b pb-2"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span className="font-semibold">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-right mt-4 font-bold text-lg text-pink-600">
              Total: ₹{order.total}
            </div>

            <div className="text-gray-500 text-sm mt-2">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
