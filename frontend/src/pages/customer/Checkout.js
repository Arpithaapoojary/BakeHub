import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      // Build order items
      const items = cart.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
      }));

      // Send to backend
      await axios.post(
        "http://localhost:5000/api/orders",
        { items, total },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Place order failed:", err);
      alert("Failed to place order!");
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl border border-pink-100 p-10">
        <h1 className="text-3xl font-bold text-[#d63384] text-center mb-10">
          Checkout
        </h1>

        <div className="space-y-6">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>

                <p className="text-xl font-semibold text-[#d63384]">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between mt-10 text-xl font-bold text-gray-800">
          <span>Total:</span>
          <span className="text-[#d63384]">₹{total}</span>
        </div>

        <button
          onClick={handleOrder}
          className="w-full mt-8 py-3 bg-[#d63384] hover:bg-[#b82a71] text-white font-semibold rounded-lg shadow-md transition"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}
