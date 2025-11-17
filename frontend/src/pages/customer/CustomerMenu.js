import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CustomerMenu() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [bakery, setBakery] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        // Get bakery details
        const bRes = await axios.get(
          `http://localhost:5000/api/bakeries/${id}`
        );
        setBakery(bRes.data);

        // Get menu
        const mRes = await axios.get(
          `http://localhost:5000/api/menu/bakery/${id}`
        );
        setMenu(mRes.data || []);
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!bakery)
    return <p className="p-10 text-center text-red-500">Bakery not found</p>;

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-pink-600 text-center">
        {bakery.name} — Menu
      </h1>

      <p className="text-center text-gray-600 mb-10">{bakery.address}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg p-5 border border-pink-100"
          >
            <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
            <p className="text-gray-500 mt-1">{item.description}</p>

            <p className="font-bold text-pink-600 mt-2 text-lg">
              ₹{item.price}
            </p>

            <button
              onClick={() => addToCart(item)}
              className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
