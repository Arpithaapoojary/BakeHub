import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  const validate = () => {
    let e = {};

    if (!address.trim()) e.address = "Address is required";
    if (!phone.match(/^[0-9]{10}$/))
      e.phone = "Enter a valid 10-digit phone number";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const placeOrder = async () => {
    if (isPlacing) return;
    if (!validate()) return;

    setIsPlacing(true);

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart,
          total: grandTotal,
          address,
          phone,
          paymentMethod,
          note,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      clearCart();
      navigate("/success");
    } catch (err) {
      alert("Order failed! Please try again.");
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-20">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">
        Checkout
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        {/* LEFT SIDE — CUSTOMER INPUT */}
        <div className="md:col-span-2 space-y-8">
          {/* ADDRESS CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Delivery Details
            </h2>

            {/* Address */}
            <div className="mb-5">
              <label className="font-medium text-gray-700">
                Delivery Address
              </label>
              <textarea
                rows={3}
                className="w-full border border-pink-200 bg-white rounded-xl p-3 mt-1 outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label className="font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                className="w-full border border-pink-200 bg-white rounded-xl p-3 mt-1 outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Payment */}
            <div className="mb-5">
              <label className="font-medium text-gray-700">
                Payment Method
              </label>
              <select
                className="w-full border border-pink-200 bg-white rounded-xl p-3 mt-1 outline-none"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="font-medium text-gray-700">
                Order Note (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full border border-pink-200 bg-white rounded-xl p-3 mt-1 outline-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any instructions for bakery..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-gray-700"
              >
                <span className="font-medium">
                  {item.name} × {item.qty}
                </span>
                <span className="text-pink-600 font-semibold">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-pink-600">₹{grandTotal}</span>
          </div>

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={placeOrder}
            disabled={isPlacing}
            className={`mt-6 w-full py-3 text-lg font-semibold text-white rounded-xl
              bg-pink-600 shadow-md
              ${
                isPlacing
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-pink-700"
              }
            `}
          >
            {isPlacing ? "Placing Order..." : "Place Order →"}
          </button>
        </div>
      </div>
    </div>
  );
}
