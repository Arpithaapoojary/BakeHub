import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Clock, CheckCircle, Truck } from "lucide-react";
import { API_URL } from "../../lib/api";

export default function OrderTracking() {
  // IMPORTANT: this must match the route: /track/:orderId
  const { orderId } = useParams();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------------
  // FETCH ORDER DETAILS
  // --------------------------------------------------------
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Normalize status
        res.data.status = res.data.status?.toLowerCase() || "pending";
        setOrder(res.data);
      } catch (err) {
        console.error("Track order error:", err);
        setError("Unable to load this order. You may not be authorized.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      loadOrder();
    } else {
      setError("Invalid order or session. Please login again.");
      setLoading(false);
    }
  }, [orderId, token]);

  // --------------------------------------------------------
  // LOADING HANDLER
  // --------------------------------------------------------
  if (loading)
    return (
      <div className="h-screen flex justify-center items-center text-pink-600 text-xl">
        Loading order...
      </div>
    );

  // --------------------------------------------------------
  // ERROR HANDLER
  // --------------------------------------------------------
  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-red-600 text-xl">
        {error}
      </div>
    );

  if (!order)
    return (
      <div className="h-screen flex justify-center items-center text-gray-600 text-xl">
        Order not found.
      </div>
    );

  // --------------------------------------------------------
  // STATUS BADGE MAP
  // --------------------------------------------------------
  const statusBadge = {
    pending: {
      text: "Pending Confirmation",
      class: "bg-yellow-100 text-yellow-700",
    },
    confirmed: {
      text: "Confirmed – Baking Started",
      class: "bg-blue-100 text-blue-700",
    },
    ready: {
      text: "Ready for Pickup",
      class: "bg-purple-100 text-purple-700",
    },
    completed: {
      text: "Delivered Successfully",
      class: "bg-green-100 text-green-700",
    },
  };

  const currentStatus = statusBadge[order.status] || {
    text: order.status,
    class: "bg-gray-200 text-gray-700",
  };

  // --------------------------------------------------------
  // TRACKING STEPS
  // --------------------------------------------------------
  const steps = [
    { key: "pending", label: "Order Placed", icon: <Clock size={16} /> },
    {
      key: "confirmed",
      label: "Baking Started",
      icon: <CheckCircle size={16} />,
    },
    { key: "ready", label: "Ready for Pickup", icon: <Truck size={16} /> },
    {
      key: "completed",
      label: "Order Completed",
      icon: <CheckCircle size={16} />,
    },
  ];

  const currentStep = steps.findIndex((s) => s.key === order.status);

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-14 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-200">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Track Your Order
        </h1>

        {/* Status Badge */}
        <div className="flex justify-center mt-4 mb-6">
          <span
            className={`px-5 py-2 rounded-full text-sm font-semibold ${currentStatus.class}`}
          >
            {currentStatus.text}
          </span>
        </div>

        {/* Order basic info */}
        <h2 className="text-lg font-bold mb-1">Order #{order._id.slice(-6)}</h2>
        <p className="text-gray-500 mb-6">
          Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
        </p>

        {/* PROGRESS STEPS */}
        <div className="space-y-5 mt-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              {/* Step Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                  idx <= currentStep ? "bg-pink-600" : "bg-gray-300"
                }`}
              >
                {step.icon}
              </div>

              {/* Line */}
              <div className="flex-1 border-t border-gray-300"></div>

              {/* Label */}
              <span
                className={`font-semibold ${
                  idx <= currentStep ? "text-pink-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* ORDER ITEMS */}
        <div className="mt-10 bg-pink-50 p-5 rounded-xl border border-pink-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>

          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-pink-100"
            >
              <span className="font-medium text-gray-700">
                {item.qty} × {item.name}
              </span>

              <span className="font-semibold text-gray-800">
                ₹{item.qty * item.price}
              </span>
            </div>
          ))}

          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total</span>
            <span className="text-pink-600">₹{order.total}</span>
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="mt-8 p-5 rounded-xl bg-white border border-gray-200">
          <p className="text-gray-700 font-semibold">
            Payment Method:{" "}
            <span className="text-pink-600">
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
          </p>

          <p className="text-gray-700 font-semibold mt-1">
            Payment Status:{" "}
            <span
              className={
                order.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {order.paymentStatus.toUpperCase()}
            </span>
          </p>

          <p className="text-gray-700 font-semibold mt-1">
            Paid Amount:{" "}
            <span className="text-pink-600">₹{order.paidAmount}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
