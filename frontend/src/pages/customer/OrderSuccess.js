import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();

  // Trigger confetti burst on load
  useEffect(() => {
    confetti({
      particleCount: 180,
      spread: 65,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5FA] flex items-center justify-center px-5 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl text-center border border-pink-100">
        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-5">
          <CheckCircle size={100} className="text-green-500 drop-shadow-lg" />
        </div>

        {/* SUCCESS MESSAGE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Order Placed Successfully! 🎉
        </h1>

        <p className="text-gray-600 text-lg">
          Thank you for ordering with{" "}
          <span className="text-pink-600 font-semibold">BakeHub</span>.
        </p>
        <p className="text-gray-500 mt-1">
          Your delicious treats are being prepared.
        </p>

        {/* DELIVERY ESTIMATE */}
        <div className="bg-pink-50 p-5 mt-8 rounded-2xl border border-pink-200">
          <h3 className="text-xl font-semibold text-pink-600 mb-1">
            Estimated Delivery Time
          </h3>
          <p className="text-gray-700 text-lg">30–45 minutes</p>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Track Order →
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl bg-white border text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
