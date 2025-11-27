import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Truck } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5FA] text-pink-600">
        Loading order...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5FA]">
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
    if (s === "pending") return "Pending";
    if (s === "confirmed") return "Confirmed";
    if (s === "ready") return "Ready for Pickup";
    if (s === "completed") return "Completed";
    return s;
  };

  return (
    <div className="min-h-screen bg-[#FFF5FA]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">Order Tracking</h1>
            <p className="text-sm text-gray-600 mt-1">
              Order #{order._id.slice(-6)} • Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="text-sm px-4 py-2 rounded-lg border border-pink-200 text-pink-600 hover:bg-pink-50 transition"
          >
            Back to My Orders
          </button>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-pink-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h2>

          <div className="flex flex-col gap-6">
            {STEPS.map((step, index) => {
              const done = index < currentIndex;
              const active = index === currentIndex;

              return (
                <div key={step} className="flex gap-4 items-start">
                  {/* Icon + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? (
                        <CheckCircle size={18} />
                      ) : active ? (
                        <Clock size={18} />
                      ) : (
                        <Clock size={16} />
                      )}
                    </div>
                    {index !== STEPS.length - 1 && (
                      <div
                        className={`w-px h-10 ${
                          done ? "bg-green-300" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">
                        {getLabel(step)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {index < currentIndex
                          ? "Completed"
                          : active
                          ? "In progress"
                          : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {step === "pending" &&
                        "We received your order and will start processing soon."}
                      {step === "confirmed" &&
                        "Bakery has confirmed your order and started preparing."}
                      {step === "ready" &&
                        "Your order is ready for pickup / handover."}
                      {step === "completed" &&
                        "Order is completed. Enjoy your treats!"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-pink-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <ul className="space-y-2 text-sm text-gray-700 mb-4">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b border-pink-50 pb-1"
              >
                <span>
                  {item.name} × <b>{item.qty}</b>
                </span>
                <span>₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span className="text-pink-600">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
