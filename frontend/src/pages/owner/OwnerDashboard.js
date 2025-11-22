import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Home,
  Store,
  BarChart2,
  Settings,
  LogOut,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function OwnerDashboard() {
  const token = localStorage.getItem("token");

  const [active, setActive] = useState("dashboard");
  const [bakery, setBakery] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Product Modal
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isSoldOut: false,
    category: "Uncategorized",
  });

  // -------------------------------------------------------------------
  // FETCH OWNER BAKERY
  // -------------------------------------------------------------------
  const loadBakery = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bakeries/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBakery(res.data);
    } catch (err) {
      console.error("Bakery load error", err);
    }
  };

  // -------------------------------------------------------------------
  // FETCH OWNER PRODUCTS
  // -------------------------------------------------------------------
  const loadProducts = async () => {
    if (!bakery?._id) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${bakery._id}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Products load error", err);
    }
  };

  // -------------------------------------------------------------------
  // FETCH OWNER ORDERS
  // -------------------------------------------------------------------
  const loadOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/owner-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Orders load error", err);
    }
  };

  // -------------------------------------------------------------------
  // FETCH ANALYTICS
  // -------------------------------------------------------------------
  const loadAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analytics/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics load error", err);
    }
  };

  // FETCH ALL DATA ON LOAD
  useEffect(() => {
    loadBakery();
  }, []);

  useEffect(() => {
    if (bakery?._id) {
      loadProducts();
      loadOrders();
      loadAnalytics();
    }
  }, [bakery]);

  // -------------------------------------------------------------------
  // HANDLE PRODUCT SAVE (CREATE OR UPDATE)
  // -------------------------------------------------------------------
  const saveProduct = async () => {
    try {
      if (editProduct._id) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/products/${editProduct._id}`,
          {
            name: editProduct.name,
            description: editProduct.description,
            price: Number(editProduct.price),
            imageUrl: editProduct.imageUrl,
            isSoldOut: editProduct.isSoldOut,
            category: editProduct.category,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // CREATE
        await axios.post(
          `http://localhost:5000/api/products`,
          {
            bakeryId: bakery._id,
            name: editProduct.name,
            description: editProduct.description,
            price: Number(editProduct.price),
            imageUrl: editProduct.imageUrl,
            isSoldOut: editProduct.isSoldOut,
            category: editProduct.category,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setShowModal(false);
      setEditProduct({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        isSoldOut: false,
        category: "Uncategorized",
      });
      loadProducts();
    } catch (err) {
      console.error("Save product error", err);
    }
  };

  // -------------------------------------------------------------------
  // DELETE PRODUCT
  // -------------------------------------------------------------------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadProducts();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // -------------------------------------------------------------------
  // UPDATE ORDER STATUS
  // -------------------------------------------------------------------
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadOrders();
    } catch (err) {
      console.error("Order update error", err);
    }
  };

  // -------------------------------------------------------------------
  // COMPONENT UI
  // -------------------------------------------------------------------
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "products", label: "Menu Items", icon: <Store size={18} /> },
    { id: "orders", label: "Orders", icon: <Clock size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F4FF]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl border-r p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-pink-600 mb-10">
          BakeHub • Owner
        </h1>

        {menu.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`flex gap-3 items-center p-3 rounded-lg mb-2 transition ${
              active === m.id ? "bg-pink-100 text-pink-600" : "text-gray-700"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}

        <button className="flex gap-3 items-center mt-auto text-red-500 hover:text-red-600">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* ------------------ DASHBOARD ------------------ */}
        {active === "dashboard" && (
          <div>
            <h2 className="text-4xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow border">
                <p className="text-gray-500">Total Products</p>
                <h3 className="text-3xl font-bold">{products.length}</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow border">
                <p className="text-gray-500">Total Orders</p>
                <h3 className="text-3xl font-bold">{orders.length}</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow border">
                <p className="text-gray-500">Total Revenue</p>
                <h3 className="text-3xl font-bold">
                  ₹{analytics?.totalRevenue || 0}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* ------------------ PRODUCTS ------------------ */}
        {active === "products" && (
          <div>
            <div className="flex justify-between mb-5">
              <h2 className="text-3xl font-bold">Menu Items</h2>
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() => {
                  setEditProduct({
                    name: "",
                    description: "",
                    price: "",
                    imageUrl: "",
                    isSoldOut: false,
                    category: "Uncategorized",
                  });
                  setShowModal(true);
                }}
              >
                <PlusCircle size={20} /> Add Item
              </button>
            </div>

            {/* PRODUCT LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white p-5 rounded-xl border shadow hover:shadow-lg transition"
                >
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/300"}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                    alt=""
                  />
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="text-gray-500 text-sm">{p.description}</p>

                  <p className="text-lg font-bold text-pink-600 mt-2">
                    ₹{p.price}
                  </p>

                  <span className="text-sm px-2 py-1 bg-purple-200 text-purple-700 rounded-full">
                    {p.category}
                  </span>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => {
                        setEditProduct(p);
                        setShowModal(true);
                      }}
                      className="text-blue-600"
                    >
                      <Edit3 />
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-500"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------ ORDERS ------------------ */}
        {active === "orders" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Orders</h2>

            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-white p-5 rounded-xl border shadow mb-4"
              >
                <h3 className="text-xl font-bold">Order #{o._id.slice(-6)}</h3>

                <p className="text-gray-500">Total: ₹{o.total}</p>

                <div className="mt-2">
                  {o.items.map((i) => (
                    <p key={i.name}>
                      {i.qty} × {i.name}
                    </p>
                  ))}
                </div>

                <select
                  className="mt-4 p-2 border rounded"
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* ------------------ ANALYTICS ------------------ */}
        {active === "analytics" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Analytics</h2>
            <p>Total Revenue: ₹{analytics?.totalRevenue || 0}</p>
            <p>Total Orders: {analytics?.totalOrders || 0}</p>
          </div>
        )}

        {/* ------------------ SETTINGS ------------------ */}
        {active === "settings" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </main>

      {/* PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-96">
            <h3 className="text-2xl font-bold mb-4">
              {editProduct._id ? "Edit Item" : "Add Item"}
            </h3>

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Name"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />

            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
            />

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Price"
              type="number"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Image URL"
              value={editProduct.imageUrl}
              onChange={(e) =>
                setEditProduct({ ...editProduct, imageUrl: e.target.value })
              }
            />

            {/* CATEGORY DROPDOWN */}
            <select
              className="w-full p-2 border rounded mb-4"
              value={editProduct.category}
              onChange={(e) =>
                setEditProduct({ ...editProduct, category: e.target.value })
              }
            >
              <option>Cakes</option>
              <option>Pastries</option>
              <option>Breads</option>
              <option>Cookies</option>
              <option>Snacks</option>
              <option>Beverages</option>
              <option>Uncategorized</option>
            </select>

            {/* SAVE BUTTON */}
            <button
              className="bg-pink-600 text-white w-full py-2 rounded-lg"
              onClick={saveProduct}
            >
              Save
            </button>

            <button
              className="mt-3 text-gray-600 w-full"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
