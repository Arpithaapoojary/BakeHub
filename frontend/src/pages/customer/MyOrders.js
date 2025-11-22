import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle, Truck } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-pink-600">
        Loading your orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          className="w-40 opacity-80"
          alt="No Orders"
        />
        <h2 className="text-2xl font-semibold mt-5 text-gray-700">
          You haven't placed any orders yet.
        </h2>
        <p className="text-gray-500 mt-2">
          Start exploring delicious bakeries!
        </p>
      </div>
    );

  // Get icon + badge color based on status
  const getStatusBadge = (status) => {
    if (status === "pending")
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-sm rounded-full flex items-center gap-2 w-fit">
          <Clock size={16} /> Pending
        </span>
      );
    if (status === "confirmed")
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full flex items-center gap-2 w-fit">
          <Truck size={16} /> Confirmed
        </span>
      );
    if (status === "completed")
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full flex items-center gap-2 w-fit">
          <CheckCircle size={16} /> Completed
        </span>
      );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 hover:shadow-2xl transition"
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Order ID: {order._id.slice(-6)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              {getStatusBadge(order.status)}
            </div>

            {/* ITEMS */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Ordered Items:
              </h3>

              <ul className="space-y-2 text-gray-700">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between text-sm md:text-base border-b pb-1"
                  >
                    <span>
                      {item.name} × <b>{item.qty}</b>
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Total: <span className="text-pink-600">₹{order.total}</span>
              </h3>

              <div className="flex gap-3">
                {/* Track Order */}
                <button
                  className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition shadow"
                  onClick={() => alert("Tracking page coming soon")}
                >
                  Track Order →
                </button>

                {/* Reorder */}
                <button
                  className="bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                  onClick={() => alert("Reorder feature coming soon")}
                >
                  Reorder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
