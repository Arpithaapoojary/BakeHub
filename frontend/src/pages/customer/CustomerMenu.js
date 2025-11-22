import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Search } from "lucide-react";

/**
 * CustomerMenu (improved)
 * - Uses product.category
 * - Static category chips (derived from known list, but also shows categories from products)
 * - Search + Sort (price low-high / high-low / popular)
 * - Swiggy-style cards, quantity selector, add-to-cart
 */

const STATIC_CATEGORIES = [
  "All",
  "Cakes",
  "Pastries",
  "Breads",
  "Cookies",
  "Snacks",
  "Beverages",
];

export default function CustomerMenu() {
  const { id } = useParams(); // bakeryId
  const [products, setProducts] = useState([]);
  const [bakery, setBakery] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("recommended"); // recommended | price-asc | price-desc
  const [qtyMap, setQtyMap] = useState({}); // quantity per product

  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Bakery info
        const bRes = await axios.get(
          `http://localhost:5000/api/bakeries/${id}`
        );
        setBakery(bRes.data);

        // Owner products
        const pRes = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        // Normalize category fallback
        const normalized = (pRes.data || []).map((p) => ({
          ...p,
          category: p.category || "Uncategorized",
          imageUrl: p.imageUrl || p.image || p.imageUrl || "",
        }));
        setProducts(normalized);
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // derived category list (products + static)
  const categories = useMemo(() => {
    const prodCats = Array.from(
      new Set(products.map((p) => p.category || "Uncategorized"))
    );
    // merge static so UI stays consistent
    return Array.from(new Set([...STATIC_CATEGORIES, ...prodCats]));
  }, [products]);

  // Filtered & sorted products
  const filtered = useMemo(() => {
    let list = [...products];
    const q = (query || "").trim().toLowerCase();
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter(
        (p) => (p.category || "Uncategorized") === selectedCategory
      );
    }
    if (q) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price-desc")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    // recommended or default keeps server order
    return list;
  }, [products, selectedCategory, query, sort]);

  const incrementQty = (id) =>
    setQtyMap((m) => ({ ...m, [id]: (m[id] || 1) + 1 }));
  const decrementQty = (id) =>
    setQtyMap((m) => ({ ...m, [id]: Math.max(1, (m[id] || 1) - 1) }));

  const handleAddToCart = (product) => {
    const qty = qtyMap[product._id] || 1;
    addToCart({ ...product, qty });
    // small UI feedback — reset qty to 1
    setQtyMap((m) => ({ ...m, [product._id]: 1 }));
  };

  if (loading) return <div className="p-10 text-center">Loading menu...</div>;
  if (!bakery)
    return (
      <div className="p-10 text-center text-red-500">Bakery not found</div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pink-600">{bakery.name}</h1>
          <p className="text-sm text-slate-500">{bakery.address}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border rounded-lg px-3 py-2 gap-2 shadow-sm">
            <Search size={16} />
            <input
              className="outline-none w-64"
              placeholder="Search cakes, snacks, beverages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="ml-3 border rounded-lg px-3 py-2 bg-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === c
                ? "bg-pink-600 text-white"
                : "bg-white border text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-slate-500">
            No items match your search.
          </div>
        )}

        {filtered.map((p) => (
          <div
            key={p._id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
              p.isSoldOut ? "opacity-60" : ""
            }`}
          >
            <div className="h-44 bg-gray-100 overflow-hidden">
              <img
                src={
                  p.imageUrl ||
                  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                }
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm text-slate-500">{p.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-pink-600 font-bold text-lg">
                    ₹{p.price}
                  </div>
                  {p.isBestseller && (
                    <div className="text-xs mt-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Bestseller
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementQty(p._id)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <div className="px-3 py-1 border rounded text-sm">
                    {qtyMap[p._id] || 1}
                  </div>
                  <button
                    onClick={() => incrementQty(p._id)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                <div>
                  {p.isSoldOut ? (
                    <div className="px-4 py-2 rounded-md bg-red-100 text-red-700">
                      Sold out
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-4 py-2 rounded-md bg-pink-600 text-white shadow"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
