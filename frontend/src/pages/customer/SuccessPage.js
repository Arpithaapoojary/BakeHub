import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-10">
      <div className="bg-white p-10 rounded-3xl shadow-lg border border-pink-100 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 Order Successful!
        </h1>

        <p className="text-gray-700 text-lg mb-8">
          Thank you for ordering with{" "}
          <span className="font-semibold text-pink-600">BakeHub</span> ❤️ Your
          treats are on the way!
        </p>

        <button
          onClick={() => navigate("/customer")}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-pink-700 transition"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}
