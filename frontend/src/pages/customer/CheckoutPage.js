import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Phone,
  CreditCard,
  Wallet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  // Totals
  const subtotal = cart.reduce((t, i) => t + i.price * i.qty, 0);
  const deliveryCharge = subtotal > 300 ? 0 : 29;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryCharge + tax;

  // VALIDATION
  const validate = () => {
    const e = {};

    if (address.trim().length < 10) {
      e.address = "Please enter full valid address";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      e.phone = "Enter valid 10-digit phone number";
    }
    if (!paymentMethod) {
      e.paymentMethod = "Choose payment method";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;

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
      console.log(err);
      alert("Order failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-4 animate-fadeIn">
      {/* ---------------- TOP STEPS ---------------- */}
      <div className="max-w-4xl mx-auto flex justify-between mb-10">
        {[
          { step: 1, label: "Cart" },
          { step: 2, label: "Address" },
          { step: 3, label: "Payment" },
        ].map((item) => (
          <div key={item.step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold 
                ${item.step <= 2 ? "bg-pink-600" : "bg-gray-300"}`}
            >
              {item.step}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
        {/* ---------------- LEFT SIDE FORM ---------------- */}
        <div className="lg:col-span-2 space-y-8">
          {/* ADDRESS SECTION */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-pink-100 animate-slideUp">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
              <MapPin className="text-pink-600" /> Delivery Address
            </h2>

            <textarea
              placeholder="Flat / House No, Building, Area, Landmark..."
              className={`w-full p-4 h-28 rounded-xl border text-gray-700 
                focus:ring-2 outline-none shadow-sm
                ${
                  errors.address
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-pink-300"
                }`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {errors.address && (
              <p className="text-red-500 flex items-center gap-1 text-sm mt-2">
                <AlertCircle size={16} /> {errors.address}
              </p>
            )}
          </div>

          {/* CONTACT SECTION */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-pink-100 animate-slideUp">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
              <Phone className="text-pink-600" /> Contact Number
            </h2>

            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              className={`w-full p-4 rounded-xl border text-gray-700 shadow-sm 
                focus:ring-2 outline-none
                ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-pink-300"
                }`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {errors.phone && (
              <p className="text-red-500 flex items-center gap-1 text-sm mt-2">
                <AlertCircle size={16} /> {errors.phone}
              </p>
            )}
          </div>

          {/* PAYMENT SECTION */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-pink-100 animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>

            <div className="space-y-4">
              {/* COD */}
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer shadow-sm transition
                ${
                  paymentMethod === "cod"
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-300 hover:bg-pink-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="flex items-center gap-2">
                  <Wallet className="text-pink-600" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </label>

              {/* UPI (coming soon) */}
              <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-300 opacity-40 cursor-not-allowed">
                <input type="radio" disabled />
                <div className="flex items-center gap-2">
                  <CreditCard />
                  <span className="font-medium">UPI / Card — Coming Soon</span>
                </div>
              </label>
            </div>

            {errors.paymentMethod && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <AlertCircle size={16} /> {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* NOTE */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-pink-100 animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Note for Bakery
            </h2>

            <textarea
              placeholder="Any special instructions?"
              className="w-full p-4 h-24 rounded-xl border-gray-300 border text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-300 outline-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* ---------------- RIGHT SIDE SUMMARY ---------------- */}
        <div className="bg-white p-7 rounded-3xl shadow-xl border border-pink-100 h-fit sticky top-10 animate-slideUp">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="max-h-60 overflow-y-auto pr-2 mb-4 space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-gray-700"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium">₹{item.qty * item.price}</span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-pink-600">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg hover:shadow-xl transition active:scale-95"
          >
            Place Order →
          </button>
        </div>
      </div>
    </div>
  );
}
