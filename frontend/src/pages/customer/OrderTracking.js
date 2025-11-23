import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Loader2, Truck } from "lucide-react";

/**
 * OrderTracking.js
 * Route: /track/:orderId
 *
 * - Fetches single order via GET /api/orders/:orderId
 * - Polls every 10s to auto-refresh status (clear on unmount)
 * - Shows timeline: Pending -> Confirmed -> Preparing -> Out for delivery -> Delivered
 * - Shows bakery info, items, totals, ETA estimate
 *
 * Note: Adjust API host if you use env variables.
 */

const STATUS_STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "completed", label: "Delivered" },
];

const statusColor = (key) => {
  if (key === "completed") return "bg-green-100 text-green-700";
  if (key === "out_for_delivery") return "bg-amber-100 text-amber-700";
  if (key === "preparing") return "bg-blue-100 text-blue-700";
  if (key === "confirmed") return "bg-indigo-100 text-indigo-700";
  return "bg-yellow-100 text-yellow-700"; // pending
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);
  const intervalRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrder(res.data);
      setLoading(false);
      // If order is completed, stop polling.
      if (res.data?.status === "completed") setPolling(false);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // start polling every 10s
    intervalRef.current = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => {
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Helper: map order.status to step index
  const currentStepIndex = () => {
    if (!order || !order.status) return 0;
    const idx = STATUS_STEPS.findIndex((s) => s.key === order.status);
    return idx === -1 ? 0 : idx;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-pink-600 font-semibold">Loading order...</div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <p className="text-gray-700 mb-4">Order not found.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  const stepIndex = currentStepIndex();

  // Prepare ETA: simple heuristic — you can replace with real data
  const eta = (() => {
    switch (order.status) {
      case "pending":
        return "15–25 min";
      case "confirmed":
        return "20–35 min";
      case "preparing":
        return "25–40 min";
      case "out_for_delivery":
        return "5–15 min";
      case "completed":
        return "Delivered";
      default:
        return "30–45 min";
    }
  })();

  return (
    <div className="min-h-screen bg-[#FFF5FA] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">Track Order</h1>
            <p className="text-sm text-slate-500 mt-1">
              Order #{order._id.slice(-8)} — Placed{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">Estimated</div>
            <div className="text-lg font-semibold">{eta}</div>
          </div>
        </div>

        {/* Top card: status summary */}
        <div className="bg-white rounded-2xl p-6 shadow mb-6 border border-pink-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center">
                <Clock className="text-pink-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Current Status</div>
                <div className="text-xl font-semibold capitalize">{order.status.replace(/_/g, " ")}</div>
              </div>
            </div>

            <div className="text-right">
              {order.status === "completed" ? (
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">Delivered ✓</div>
              ) : (
                <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">In progress</div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow mb-6 border border-pink-100">
          <h3 className="text-lg font-semibold mb-4">Order Progress</h3>

          <div className="flex flex-col gap-6">
            {STATUS_STEPS.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <div key={s.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        done ? "bg-green-500 text-white" : active ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {done ? <CheckCircle size={18} /> : active ? <Loader2 size={18} className="animate-spin" /> : <Clock size={14} />}
                    </div>
                    {i !== STATUS_STEPS.length - 1 && (
                      <div className={`w-px h-12 ${done ? "bg-green-300" : "bg-gray-200"} mt-1`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800">{s.label}</div>
                      <div className="text-sm text-slate-500">
                        {i < stepIndex ? "Completed" : active ? "In progress" : "Waiting"}
                      </div>
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {i === stepIndex && order?.statusMessage
                        ? order.statusMessage
                        : i < stepIndex
                        ? `Finished at ${new Date(order.updatedAt).toLocaleTimeString()}`
                        : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order details + bakery */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow border border-pink-100">
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            <div className="space-y-3">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-slate-500">Qty: {it.qty}</div>
                  </div>
                  <div className="text-sm font-semibold">₹{it.price * it.qty}</div>
                </div>
              ))}

              <hr className="my-3" />

              <div className="flex justify-between text-gray-700">
                <div>Subtotal</div>
                <div>₹{order.total}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-pink-100">
            <h3 className="text-lg font-semibold mb-3">Bakery</h3>
            <div className="text-sm text-slate-700 mb-3">
              {order.bakeryName || order.bakery?.name || "Bakery"}
            </div>

            <div className="text-sm text-slate-500 mb-4">
              Contact: {order.customerPhone || order.phone || "—"}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/orders")}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white"
              >
                My Orders
              </button>

              <button
                onClick={() => alert("Track on map coming soon")}
                className="px-4 py-2 rounded-lg border"
              >
                Track on Map
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          This page refreshes automatically every 10 seconds.
        </div>
      </div>
    </div>
  );
}
