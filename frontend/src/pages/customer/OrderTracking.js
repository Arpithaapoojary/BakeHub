import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  ChevronLeft,
  Bike,
} from "lucide-react";

const STEPS = ["pending", "confirmed", "ready", "completed"];

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white text-pink-600 text-lg">
        Loading your order...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <p className="text-gray-700 mb-4">Order not found.</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );

  const currentIndex = STEPS.indexOf(order.status);

  const getLabel = (s) => {
    switch (s) {
      case "pending":
        return "Pending Confirmation";
      case "confirmed":
        return "Order Confirmed";
      case "ready":
        return "Ready for Pickup";
      case "completed":
        return "Delivered";
      default:
        return s;
    }
  };

  const getDescription = (s) => {
    if (s === "pending")
      return "We received your order and are waiting for the bakery to confirm.";
    if (s === "confirmed")
      return "The bakery has confirmed your order and is preparing your treats.";
    if (s === "ready") return "Your items are ready for pickup / handover.";
    if (s === "completed") return "Order delivered successfully. Enjoy!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-5">
      {/* ---------------- HEADER ---------------- */}
      <div className="max-w-4xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-600">
            Track Your Order
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Order #{order._id.slice(-6)} •{" "}
            {new Date(order.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 text-pink-600 hover:bg-pink-100 transition"
        >
          <ChevronLeft size={18} /> Back
        </button>
      </div>

      {/* ---------------- ESTIMATE CARD ---------------- */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-200 p-6 flex items-center gap-6">
          <div className="bg-pink-100 p-4 rounded-full">
            <Bike
              size={40}
              className="text-pink-600 animate-[bounce_1.5s_infinite]"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Estimated Delivery
            </h2>
            <p className="text-lg font-semibold text-pink-600">
              30 – 45 minutes
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              Your order is on its way!
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- TIMELINE ---------------- */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-pink-100 p-8 mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Order Status
        </h2>

        <div className="flex flex-col gap-8">
          {STEPS.map((step, index) => {
            const done = index < currentIndex;
            const active = index === currentIndex;

            return (
              <div key={step} className="flex gap-6">
                {/* Icons & connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm
                    ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {done ? (
                      <CheckCircle size={20} />
                    ) : active ? (
                      <Clock size={20} />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>

                  {index !== STEPS.length - 1 && (
                    <div
                      className={`w-1 h-14 ${
                        done ? "bg-green-300" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getLabel(step)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {getDescription(step)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- ORDER SUMMARY ---------------- */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-pink-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-pink-50 pb-2"
            >
              <span className="text-gray-700">
                {item.name} × <b>{item.qty}</b>
              </span>
              <span className="font-semibold text-gray-900">
                ₹{item.price * item.qty}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 text-lg font-semibold">
          <span>Total</span>
          <span className="text-pink-600">₹{order.total}</span>
        </div>
      </div>
    </div>
  );
}
