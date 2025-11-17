import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerMenu() {
  const [bakery, setBakery] = useState(null);
  const [loading, setLoading] = useState(true);

  const [item, setItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const [menu, setMenu] = useState([]);

  const token = localStorage.getItem("token");

  // 1️⃣ Fetch owner's bakery
  useEffect(() => {
    const loadBakery = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bakeries/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBakery(res.data);

        // Fetch existing menu items for this bakery
        const menuRes = await axios.get(
          `http://localhost:5000/api/menu/bakery/${res.data._id}`
        );
        setMenu(menuRes.data);
      } catch (err) {
        console.error("Error loading bakery:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBakery();
  }, []);

  // 2️⃣ Handle input change
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // 3️⃣ Add menu item
  const handleAdd = async () => {
    if (!bakery?._id) {
      alert("Bakery not loaded yet.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/menu",
        {
          ...item,
          bakeryId: bakery._id, // IMPORTANT ✔
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMenu([...menu, res.data]); // update UI
      setItem({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
      });
      alert("Item added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add menu item.");
    }
  };

  if (loading)
    return <p className="p-10 text-center">Loading your bakery...</p>;

  if (!bakery)
    return (
      <p className="p-10 text-center text-red-500 text-lg">
        No bakery found. Please wait for admin approval.
      </p>
    );

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-orange-500 text-center mb-8">
        🍰 Manage Your Menu
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={item.name}
            onChange={handleChange}
            className="border p-3 rounded"
            placeholder="Item Name"
          />
          <input
            name="price"
            value={item.price}
            onChange={handleChange}
            className="border p-3 rounded"
            placeholder="Price (₹)"
          />
          <input
            name="category"
            value={item.category}
            onChange={handleChange}
            className="border p-3 rounded"
            placeholder="Category"
          />
        </div>

        <input
          name="image"
          value={item.image}
          onChange={handleChange}
          className="border p-3 rounded w-full mt-4"
          placeholder="Image URL"
        />

        <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
          className="border p-3 rounded w-full mt-4"
          rows="3"
          placeholder="Description"
        />

        <button
          onClick={handleAdd}
          className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
        >
          ➕ Add Menu Item
        </button>
      </div>

      {/* Show added items */}
      <div className="mt-10">
        {menu.length === 0 ? (
          <p className="text-center text-gray-500">
            No menu items yet. Start adding your creations! 🍩
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.map((m) => (
              <div key={m._id} className="p-4 border rounded-xl shadow-sm">
                <h2 className="text-lg font-bold">{m.name}</h2>
                <p className="text-gray-600">₹{m.price}</p>
                <p>{m.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
