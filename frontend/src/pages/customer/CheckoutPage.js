import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, CreditCard, Wallet } from "lucide-react";
import axios from "axios";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const deliveryCharge = subtotal > 300 ? 0 : 29;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryCharge + tax;

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert("Please enter your address");
    if (!phone.trim()) return alert("Please enter your phone number");

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          bakeryId: item.bakeryId || item.bakery?._id,
        })),
        total: grandTotal,
      };

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      clearCart();
      navigate("/success");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5FA] py-10 px-5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
        {/* ---------------- LEFT SIDE ---------------- */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-pink-600 mb-8">Checkout</h1>

          {/* STEP BAR */}
          <div className="flex items-center mb-10">
            <div className="flex items-center text-pink-600 font-semibold">
              Cart
            </div>
            <div className="flex-1 h-[2px] bg-pink-300 mx-3"></div>
            <div className="flex items-center text-pink-600 font-semibold">
              Address
            </div>
            <div className="flex-1 h-[2px] bg-pink-300 mx-3"></div>
            <div className="flex items-center text-pink-600 font-semibold">
              Payment
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-7 rounded-2xl shadow-xl border border-pink-100 mb-8">
            <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 mb-4">
              <MapPin size={22} className="text-pink-500" /> Delivery Address
            </h2>

            <textarea
              className="w-full border rounded-lg p-4 h-28 text-gray-700 shadow-sm"
              placeholder="Enter your full address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          {/* PHONE */}
          <div className="bg-white p-7 rounded-2xl shadow-xl border border-pink-100 mb-8">
            <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 mb-4">
              <Phone size={22} className="text-pink-500" /> Contact Number
            </h2>

            <input
              type="tel"
              className="w-full border rounded-lg p-4 shadow-sm text-gray-700"
              placeholder="Enter phone number..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-7 rounded-2xl shadow-xl border border-pink-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
              Payment Method
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
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

              <label className="flex items-center gap-3 p-4 border rounded-xl opacity-40 cursor-not-allowed">
                <input type="radio" disabled />
                <div className="flex items-center gap-2">
                  <CreditCard />
                  <span className="font-medium">UPI / Card — Coming Soon</span>
                </div>
              </label>
            </div>
          </div>

          {/* NOTE */}
          <div className="bg-white p-7 rounded-2xl shadow-xl border border-pink-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Note for Bakery
            </h2>
            <textarea
              className="w-full border rounded-lg p-4 h-24 text-gray-700 shadow-sm"
              placeholder="Any special instructions?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE SUMMARY ---------------- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-7 rounded-2xl shadow-2xl border border-pink-100 sticky top-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* ITEMS LIST */}
            <div className="max-h-60 overflow-y-auto pr-2 mb-5">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between mb-3 text-gray-700"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>₹{item.qty * item.price}</span>
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
                <span>Delivery Charge</span>
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

              <hr />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-pink-600">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xl font-semibold shadow-lg hover:shadow-xl transition"
            >
              Place Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
