// src/pages/owner/OwnerDashboard.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Home,
  Store,
  BarChart2,
  Settings,
  LogOut,
  Search as SearchIcon,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  User,
  ChevronLeft,      // ✅ ADD THIS
  ChevronRight      // ✅ ADD THIS
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const STATUS_COLORS = {
  approved: "#10B981",
  pending: "#F59E0B",
  rejected: "#EF4444",
};

const PAGE_SIZE = 6;

export default function OwnerDashboard() {
  const [section, setSection] = useState("dashboard"); // dashboard | orders | menu | analytics | settings
  const [bakery, setBakery] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null); // product being edited
  const [showProductForm, setShowProductForm] = useState(false);

  const token = localStorage.getItem("token");

  // --- Fetch bakery (owner's bakery) ---
  useEffect(() => {
    const fetchBakery = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/bakeries/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBakery(res.data);
      } catch (err) {
        console.error("fetch bakery:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBakery();
  }, [token]);

  // --- Fetch products for bakery ---
  useEffect(() => {
    const fetchProducts = async () => {
      if (!bakery?._id) return;
      setProdLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${bakery._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("fetch products:", err.response?.data || err.message);
      } finally {
        setProdLoading(false);
      }
    };
    fetchProducts();
  }, [bakery, token]);

  // --- Fetch owner orders ---
  useEffect(() => {
    const fetchOrders = async () => {
      setOrderLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/owner-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("fetch orders:", err.response?.data || err.message);
      } finally {
        setOrderLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // ---------- PRODUCTS CRUD ----------
  const openCreateProduct = () => {
    setEditProduct({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      isSoldOut: false,
    });
    setShowProductForm(true);
  };

  const saveProduct = async () => {
    if (!editProduct) return;
    try {
      // if editing existing (has _id) -> PUT else POST
      if (editProduct._id) {
        const res = await axios.put(
          `http://localhost:5000/api/products/${editProduct._id}`,
          {
            name: editProduct.name,
            description: editProduct.description,
            price: Number(editProduct.price),
            imageUrl: editProduct.imageUrl,
            isSoldOut: !!editProduct.isSoldOut,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts((p) =>
          p.map((x) => (x._id === res.data._id ? res.data : x))
        );
      } else {
        const res = await axios.post(
          `http://localhost:5000/api/products`,
          {
            bakeryId: bakery._id,
            name: editProduct.name,
            description: editProduct.description,
            price: Number(editProduct.price),
            imageUrl: editProduct.imageUrl,
            isSoldOut: !!editProduct.isSoldOut,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts((p) => [res.data, ...p]);
      }
      setShowProductForm(false);
      setEditProduct(null);
    } catch (err) {
      console.error("saveProduct:", err.response?.data || err.message);
      alert("Failed to save product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error("delete product:", err.response?.data || err.message);
      alert("Failed to delete product.");
    }
  };

  const toggleSoldOut = async (p) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/${p._id}`,
        { ...p, isSoldOut: !p.isSoldOut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((arr) =>
        arr.map((x) => (x._id === res.data._id ? res.data : x))
      );
    } catch (err) {
      console.error("toggleSoldOut:", err.response?.data || err.message);
    }
  };

  // ---------- ORDERS ----------
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("updateOrderStatus:", err.response?.data || err.message);
      alert("Failed to update order.");
    }
  };

  // ---------- Derived stats / analytics ----------
  const topProducts = useMemo(() => {
    // find most ordered product counts from orders items if available
    const counts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const name = it.name || it.productName || "Unknown";
        counts[name] = (counts[name] || 0) + (it.qty || 1);
      });
    });
    const arr = Object.entries(counts).map(([name, qty]) => ({ name, qty }));
    return arr.sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const monthlyOrders = useMemo(() => {
    // last 6 months
    const map = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      map[key] = 0;
    }
    orders.forEach((o) => {
      if (!o.createdAt) return;
      const k = new Date(o.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (map[k] !== undefined) map[k] += 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [orders]);

  const statusCounts = useMemo(() => {
    const approved = orders.filter(
      (o) => o.status === "completed" || o.status === "completed"
    ).length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const preparing = orders.filter(
      (o) => o.status === "preparing" || o.status === "confirmed"
    ).length;
    return {
      approved,
      pending,
      preparing,
      total: orders.length,
      pie: [
        { name: "Completed", value: approved, key: "completed" },
        { name: "Pending", value: pending, key: "pending" },
        { name: "Preparing", value: preparing, key: "preparing" },
      ],
    };
  }, [orders]);

  // ---------- FILTER + PAGINATION for products/orders ----------
  const filteredProducts = useMemo(() => {
    const q = (query || "").toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const productPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );
  const productPageData = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ---------- basic permission / loading guards ----------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            You are not logged in. Please login as owner.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading owner dashboard...
      </div>
    );
  }

  // If bakery not approved
  if (!bakery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-600">
          <h3>No bakery found. Create or contact admin to register.</h3>
        </div>
      </div>
    );
  }

  if (bakery.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-yellow-700">
            Waiting for admin approval
          </h2>
          <p className="text-slate-600 mt-2">
            You will be able to manage orders & menu once approved.
          </p>
        </div>
      </div>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 fixed h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-pink-600">BakeHub</h1>
          <div className="text-xs text-slate-500">Owner panel</div>
        </div>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setSection("dashboard")}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              section === "dashboard"
                ? "bg-pink-50 text-pink-600"
                : "hover:bg-slate-100"
            }`}
          >
            <Home size={18} /> Overview
          </button>

          <button
            onClick={() => setSection("orders")}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              section === "orders"
                ? "bg-pink-50 text-pink-600"
                : "hover:bg-slate-100"
            }`}
          >
            <Store size={18} /> Orders
          </button>

          <button
            onClick={() => setSection("menu")}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              section === "menu"
                ? "bg-pink-50 text-pink-600"
                : "hover:bg-slate-100"
            }`}
          >
            <PlusCircle size={18} /> Menu
          </button>

          <button
            onClick={() => setSection("analytics")}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              section === "analytics"
                ? "bg-pink-50 text-pink-600"
                : "hover:bg-slate-100"
            }`}
          >
            <BarChart2 size={18} /> Analytics
          </button>

          <button
            onClick={() => setSection("settings")}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              section === "settings"
                ? "bg-pink-50 text-pink-600"
                : "hover:bg-slate-100"
            }`}
          >
            <Settings size={18} /> Settings
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="flex items-center gap-3 p-2 mt-auto text-red-500 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-10 max-w-7xl mx-auto w-full">
        {/* -------- DASHBOARD -------- */}
        {section === "dashboard" && (
          <>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold">Welcome, {bakery.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Overview of your bakery performance
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSection("menu")}
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl"
                >
                  Add Product
                </button>
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <div className="text-xs text-slate-500">Total Products</div>
                <div className="text-2xl font-bold">{products.length}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <div className="text-xs text-slate-500">Total Orders</div>
                <div className="text-2xl font-bold">{orders.length}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <div className="text-xs text-slate-500">Pending Orders</div>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "pending").length}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <div className="text-xs text-slate-500">Recent Revenue</div>
                <div className="text-2xl font-bold">
                  ₹ {orders.reduce((s, o) => s + (o.total || 0), 0)}
                </div>
              </div>
            </div>

            {/* Charts + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-slate-500">
                      Orders (last 6 months)
                    </div>
                    <div className="text-lg font-semibold">Monthly Orders</div>
                  </div>
                </div>

                <div style={{ height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={monthlyOrders}>
                      <CartesianGrid stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#6366f1"
                        barSize={18}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <div className="text-sm text-slate-500 mb-3">Top Products</div>
                <ol className="space-y-3">
                  {topProducts.length ? (
                    topProducts.map((t, i) => (
                      <li key={t.name} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{t.name}</div>
                          <div className="text-xs text-slate-500">
                            {t.qty} sold
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No sales yet</div>
                  )}
                </ol>
              </div>
            </div>

            {/* Recent orders list */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">Recent Orders</div>
                <div className="text-sm text-slate-400">
                  Latest {Math.min(8, orders.length)}
                </div>
              </div>

              <div className="divide-y">
                {orders.slice(0, 8).map((o) => (
                  <div
                    key={o._id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        #{o._id.slice(-6)} —{" "}
                        {o.customerName || o.customer?.name || "Customer"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ₹ {o.total || 0}
                      </div>
                      <div className="text-xs mt-1">
                        {o.status === "pending" ? (
                          <span className="text-yellow-600">Pending</span>
                        ) : o.status === "completed" ? (
                          <span className="text-green-600">Completed</span>
                        ) : (
                          <span className="text-slate-500">{o.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {!orders.length && (
                  <div className="text-sm text-slate-500 p-4">
                    No orders yet
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* -------- ORDERS -------- */}
        {section === "orders" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Orders</h2>
                <p className="text-sm text-slate-500">Manage incoming orders</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm mb-6">
              <div className="grid grid-cols-1 gap-4">
                {orderLoading ? (
                  <div>Loading orders...</div>
                ) : orders.length ? (
                  orders.map((o) => (
                    <div
                      key={o._id}
                      className="p-4 border rounded-lg flex items-start justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          #{o._id.slice(-6)} —{" "}
                          {o.customerName || o.customer?.name || "Customer"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          {(o.items || [])
                            .map((it) => `${it.name} x${it.qty}`)
                            .join(", ")}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-semibold">
                          ₹ {o.total || 0}
                        </div>
                        <div className="flex gap-2">
                          {o.status !== "confirmed" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(o._id, "confirmed")
                              }
                              className="px-3 py-1 bg-amber-500 text-white rounded-md text-sm"
                            >
                              Confirm
                            </button>
                          )}
                          {o.status !== "completed" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(o._id, "completed")
                              }
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                            >
                              Mark Complete
                            </button>
                          )}
                          <button
                            onClick={() =>
                              updateOrderStatus(o._id, "cancelled")
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No orders</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* -------- MENU (Products) -------- */}
        {section === "menu" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Menu</h2>
                <p className="text-sm text-slate-500">
                  Add, edit or remove products
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openCreateProduct()}
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl"
                >
                  Add Product
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border shadow-sm mb-6">
              <div className="flex items-center gap-3">
                <SearchIcon />
                <input
                  className="flex-1 px-3 py-2 rounded-lg border"
                  placeholder="Search product..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {prodLoading ? (
                <div>Loading products...</div>
              ) : (
                productPageData.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                  >
                    <div className="h-40 bg-slate-100 overflow-hidden">
                      <img
                        src={
                          p.imageUrl ||
                          "https://images.unsplash.com/photo-1542831371-d531d36971e6"
                        }
                        className="w-full h-full object-cover"
                        alt={p.name}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{p.name}</h3>
                          <div className="text-xs text-slate-500">
                            {p.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            ₹ {p.price}
                          </div>
                          <div className="text-xs mt-2">
                            {p.isSoldOut ? (
                              <span className="text-red-500">Sold out</span>
                            ) : (
                              <span className="text-green-600">Available</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            setEditProduct(p);
                            setShowProductForm(true);
                          }}
                          className="px-3 py-1 bg-slate-100 rounded-md"
                        >
                          <Edit3 />
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="px-3 py-1 bg-red-50 rounded-md text-red-600"
                        >
                          <Trash2 />
                        </button>
                        <button
                          onClick={() => toggleSoldOut(p)}
                          className="px-3 py-1 bg-amber-50 rounded-md text-amber-700"
                        >
                          {p.isSoldOut ? "Mark Available" : "Mark Sold"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing{" "}
                {Math.min(filteredProducts.length, (page - 1) * PAGE_SIZE + 1)}{" "}
                - {Math.min(filteredProducts.length, page * PAGE_SIZE)} of{" "}
                {filteredProducts.length}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-white border rounded-lg"
                >
                  <ChevronLeft />
                </button>
                <div className="px-3 py-1 bg-white border rounded-lg">
                  Page {page} / {productPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(productPages, p + 1))}
                  disabled={page === productPages}
                  className="p-2 bg-white border rounded-lg"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            {/* Product form modal (simple inline) */}
            {showProductForm && editProduct && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl border shadow-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {editProduct._id ? "Edit Product" : "Create Product"}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <input
                      className="px-3 py-2 border rounded-lg"
                      placeholder="Name"
                      value={editProduct.name}
                      onChange={(e) =>
                        setEditProduct({ ...editProduct, name: e.target.value })
                      }
                    />
                    <input
                      className="px-3 py-2 border rounded-lg"
                      placeholder="Short description"
                      value={editProduct.description}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          description: e.target.value,
                        })
                      }
                    />
                    <input
                      className="px-3 py-2 border rounded-lg"
                      placeholder="Price"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
                    />
                    <input
                      className="px-3 py-2 border rounded-lg"
                      placeholder="Image URL (or leave blank)"
                      value={editProduct.imageUrl}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!editProduct.isSoldOut}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            isSoldOut: e.target.checked,
                          })
                        }
                      />
                      <span className="text-sm text-slate-600">Sold out</span>
                    </label>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => {
                          setShowProductForm(false);
                          setEditProduct(null);
                        }}
                        className="px-4 py-2 rounded-md border"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveProduct}
                        className="px-4 py-2 bg-pink-600 text-white rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* -------- ANALYTICS -------- */}
        {section === "analytics" && (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold">Analytics</h2>
              <p className="text-sm text-slate-500">Sales & order trends</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
                <div className="text-sm text-slate-500 mb-2">
                  Monthly Orders
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={monthlyOrders}>
                      <CartesianGrid stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <div className="text-sm text-slate-500 mb-2">Order Status</div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={statusCounts.pie}
                        dataKey="value"
                        innerRadius={36}
                        outerRadius={80}
                        label
                      >
                        {statusCounts.pie.map((entry) => (
                          <Cell
                            key={entry.key}
                            fill={
                              entry.key === "Completed"
                                ? "#10B981"
                                : entry.key === "Pending"
                                ? "#F59E0B"
                                : "#EF4444"
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
                <h3 className="text-sm text-slate-500 mb-2">
                  Top Products (by qty)
                </h3>
                <ol className="space-y-3">
                  {topProducts.length ? (
                    topProducts.map((t, i) => (
                      <li
                        key={t.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-sm">{t.name}</div>
                            <div className="text-xs text-slate-500">
                              {t.qty} sold
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No sales data</div>
                  )}
                </ol>
              </div>

              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h3 className="text-sm text-slate-500 mb-2">Quick Summary</h3>
                <div className="text-sm text-slate-600">
                  <div>
                    Total orders: <strong>{statusCounts.total}</strong>
                  </div>
                  <div className="mt-2">
                    Pending: <strong>{statusCounts.pending}</strong>
                  </div>
                  <div className="mt-2">
                    Completed: <strong>{statusCounts.approved}</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* -------- SETTINGS -------- */}
        {section === "settings" && (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold">Settings</h2>
              <p className="text-sm text-slate-500">
                Update bakery & owner information
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-3xl">
              <label className="text-sm text-slate-500">Bakery name</label>
              <input
                className="w-full px-3 py-2 border rounded-lg mt-2"
                value={bakery.name}
                onChange={(e) => setBakery({ ...bakery, name: e.target.value })}
              />

              <label className="text-sm text-slate-500 mt-3">Address</label>
              <input
                className="w-full px-3 py-2 border rounded-lg mt-2"
                value={bakery.address || ""}
                onChange={(e) =>
                  setBakery({ ...bakery, address: e.target.value })
                }
              />

              <label className="text-sm text-slate-500 mt-3">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg mt-2"
                value={bakery.description || ""}
                onChange={(e) =>
                  setBakery({ ...bakery, description: e.target.value })
                }
              />

              <label className="text-sm text-slate-500 mt-3">Image URL</label>
              <input
                className="w-full px-3 py-2 border rounded-lg mt-2"
                value={bakery.imageUrl || ""}
                onChange={(e) =>
                  setBakery({ ...bakery, imageUrl: e.target.value })
                }
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={async () => {
                    try {
                      await axios.put(
                        `http://localhost:5000/api/bakeries/${bakery._id}`,
                        bakery,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      alert("Saved");
                    } catch (err) {
                      console.error(err);
                      alert("Failed to save.");
                    }
                  }}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setBakery({ ...bakery });
                    alert("No changes saved");
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
