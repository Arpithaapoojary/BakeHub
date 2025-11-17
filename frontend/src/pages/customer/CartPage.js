import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  // If cart empty
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 bg-pink-50">
        <div className="text-center bg-white p-10 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">
            Your cart is empty 🛒
          </h2>
          <p className="mt-3 text-gray-500">
            Add delicious treats from a bakery to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🛒 Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white p-5 rounded-2xl shadow-md flex items-center justify-between border border-pink-100"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-gray-500">₹{item.price}</p>
            </div>

            {/* Qty Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => decreaseQty(item._id)}
                className="bg-pink-200 text-pink-800 px-3 py-1 rounded-lg font-bold"
              >
                -
              </button>

              <div className="font-semibold">{item.qty || 1}</div>

              <button
                onClick={() => increaseQty(item._id)}
                className="bg-pink-500 text-white px-3 py-1 rounded-lg font-bold"
              >
                +
              </button>
            </div>

            {/* Item Total + Remove */}
            <div className="flex items-center gap-6">
              <div className="text-gray-800 font-semibold">
                ₹{(item.price * (item.qty || 1)).toFixed(2)}
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:underline font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-6 bg-pink-50 p-6 rounded-2xl border border-pink-100 shadow-md">
        <div className="text-xl font-bold text-gray-800 mb-4">
          Total: ₹{totalPrice.toFixed(2)}
        </div>

        {/* Checkout BTN FIXED */}
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold 
                     hover:bg-pink-700 transition shadow"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
