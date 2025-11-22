import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const deliveryCharge = subtotal > 300 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryCharge + tax;

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
    <div className="max-w-6xl mx-auto p-6 md:p-10 grid md:grid-cols-3 gap-10">
      {/* ---------------- LEFT SIDE: CART ITEMS ---------------- */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">🛒 Your Cart</h1>

        <div className="space-y-5">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl shadow-lg flex gap-5 border border-pink-100 hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <img
                src={item.imageUrl || "https://via.placeholder.com/120"}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover border"
              />

              {/* DETAILS */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-bold text-xl"
                  >
                    -
                  </button>

                  <span className="text-lg font-semibold">{item.qty || 1}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="bg-pink-500 text-white px-3 py-1 rounded-full font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRICE + REMOVE */}
              <div className="flex flex-col justify-between text-right">
                <p className="text-lg font-bold text-gray-800">
                  ₹{(item.price * (item.qty || 1)).toFixed(2)}
                </p>

                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- RIGHT SIDE: BILLING SECTION ---------------- */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-pink-100 sticky top-5 h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bill Summary</h2>

        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span>Delivery Charge</span>
            <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span>GST (5%)</span>
            <span>₹{tax}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-2xl font-bold text-gray-900">
            <span>Total</span>
            <span className="text-pink-600">₹{grandTotal}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white 
                     text-lg font-semibold shadow-lg hover:shadow-xl transition"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
