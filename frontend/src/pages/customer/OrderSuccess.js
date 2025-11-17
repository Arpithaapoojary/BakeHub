import React from "react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold text-[#d63384] mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-600 text-lg">
          Thank you for your order. Your bakery is preparing your delicious
          items!
        </p>

        <Link
          to="/customer"
          className="mt-8 inline-block bg-[#d63384] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#b82a71]"
        >
          Browse More Bakeries
        </Link>
      </div>
    </div>
  );
}
