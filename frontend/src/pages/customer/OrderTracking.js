import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadOrder();
  }, [id]);

  if (!order)
    return (
      <div className="h-screen flex justify-center items-center text-gray-600 text-xl">
        Loading order…
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-20">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">
        Track Your Order
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-pink-100">
        <h3 className="text-xl font-bold text-gray-900">
          Order #{order._id.slice(-6)}
        </h3>

        <p className="text-gray-500 mt-1">
          Ordered on: {new Date(order.createdAt).toLocaleString("en-IN")}
        </p>

        {/* STATUS BAR */}
        <div className="mt-6">
          {["pending", "confirmed", "ready", "completed"].map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 mb-4 ${
                order.status === step ||
                idx <=
                  ["pending", "confirmed", "ready", "completed"].indexOf(
                    order.status
                  )
                  ? "text-pink-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  order.status === step ||
                  idx <=
                    ["pending", "confirmed", "ready", "completed"].indexOf(
                      order.status
                    )
                    ? "bg-pink-600"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="font-medium">{step.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Order Summary
          </h3>

          {order.items.map((item, i) => (
            <p key={i} className="text-gray-700">
              {item.qty} × {item.name}
            </p>
          ))}

          <div className="flex justify-between mt-6 text-lg font-semibold">
            <span>Total</span>
            <span className="text-pink-600">₹{order.total}</span>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <p className="text-gray-700 font-semibold">
              Payment Method:{" "}
              <span className="text-pink-600">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </span>
            </p>

            <p className="text-gray-700 font-semibold">
              Payment Status:{" "}
              <span
                className={`${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </span>
            </p>

            <p className="text-gray-700 font-semibold">
              Paid Amount:{" "}
              <span className="text-pink-600">₹{order.paidAmount}</span>
            </p>

            {order.transactionId && (
              <p className="text-gray-500 text-sm mt-1">
                Transaction ID: {order.transactionId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
