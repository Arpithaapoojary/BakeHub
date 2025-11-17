import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryType: "pickup",
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const placeOrder = () => {
    alert("Order Placed Successfully!");
    navigate("/success");
  };

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-8">🧾 Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Customer Info */}
        <div className="bg-white p-6 rounded-2xl shadow border border-pink-100">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border rounded-lg"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full mb-4 p-3 border rounded-lg"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Address (optional for pickup)"
            className="w-full mb-4 p-3 border rounded-lg"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />

          <div className="mb-4">
            <p className="font-medium mb-2">Delivery Option:</p>

            <select
              className="w-full border p-3 rounded-lg"
              value={customer.deliveryType}
              onChange={(e) =>
                setCustomer({ ...customer, deliveryType: e.target.value })
              }
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow border border-pink-100">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xl font-bold text-gray-800">
            Total: ₹{totalPrice}
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-pink-600 text-white py-3 rounded-xl text-lg hover:bg-pink-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
