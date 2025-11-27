import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="flex flex-col items-center justify-center h-screen text-center p-5 bg-[#FFF5FA]">
        <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-4">
          <Clock className="text-pink-500" size={32} />
        </div>
        <h2 className="text-2xl font-semibold mt-2 text-gray-800">
          No orders yet
        </h2>
        <p className="text-gray-500 mt-2">
          Start exploring delicious bakeries and place your first order.
        </p>
      </div>
    );

  // Status badge UI
  const getStatusBadge = (status) => {
    if (status === "pending")
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs md:text-sm rounded-full flex items-center gap-2 w-fit">
          <Clock size={14} /> Pending
        </span>
      );
    if (status === "confirmed")
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs md:text-sm rounded-full flex items-center gap-2 w-fit">
          <Truck size={14} /> Confirmed
        </span>
      );
    if (status === "ready")
      return (
        <span className="bg-purple-100 text-purple-700 px-3 py-1 text-xs md:text-sm rounded-full flex items-center gap-2 w-fit">
          <Truck size={14} /> Ready for Pickup
        </span>
      );
    if (status === "completed")
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 text-xs md:text-sm rounded-full flex items-center gap-2 w-fit">
          <CheckCircle size={14} /> Completed
        </span>
      );
    return (
      <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs md:text-sm rounded-full">
        {status}
      </span>
    );
  };

  const handleTrack = (orderId) => {
    navigate(`/track/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF5FA]">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-pink-600 mb-8">My Orders</h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {getStatusBadge(order.status)}
              </div>

              {/* Items */}
              <div className="bg-pink-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">
                  Items
                </h3>

                <ul className="space-y-1 text-gray-700 text-sm md:text-base">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between border-b border-pink-100 pb-1"
                    >
                      <span>
                        {item.name} × <b>{item.qty}</b>
                      </span>
                      <span>₹{item.price * item.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total + Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Total: <span className="text-pink-600">₹{order.total}</span>
                </h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleTrack(order._id)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm md:text-base hover:bg-pink-600 transition shadow"
                  >
                    Track Order →
                  </button>

                  <button
                    className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm md:text-base hover:bg-gray-50 transition"
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
    </div>
  );
}
