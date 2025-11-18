import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LogOut,
  Home,
  Store,
  CheckCircle,
  Clock,
  XCircle,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const PAGE_SIZE = 9;
const STATUS_COLORS = {
  approved: "#10B981",
  pending: "#F59E0B",
  rejected: "#EF4444",
};

export default function AdminDashboard() {
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setErrorMsg("No admin token found. Please log in again.");
    }
  }, [token]);

  useEffect(() => {
    const fetchBakeries = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/bakeries", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setBakeries(res.data || []);
      } catch (err) {
        console.error("Error fetching bakeries", err);
        setErrorMsg(
          err.response?.data?.error || "Failed to load bakeries from server."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBakeries();
  }, [token]);

  // Approve bakery
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this bakery?")) return;
    try {
      await axios.put(
        `http://localhost:5000/api/bakeries/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBakeries((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      console.error("Error approving bakery", err);
      alert("Failed to approve");
    }
  };

  // Reject bakery
  const handleReject = async (id) => {
    if (!window.confirm("Reject this bakery?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/bakeries/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBakeries((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "rejected" } : b))
      );
    } catch (err) {
      console.error("Error rejecting bakery", err);
      alert("Failed to reject");
    }
  };

  // APPROVE ALL PENDING
  const handleApproveAllPending = async () => {
    const pendingList = bakeries.filter((b) => b.status === "pending");

    if (!pendingList.length) {
      alert("No pending bakeries.");
      return;
    }

    if (!window.confirm(`Approve ${pendingList.length} bakeries?`)) return;

    try {
      for (const b of pendingList) {
        await axios.put(
          `http://localhost:5000/api/bakeries/${b._id}/approve`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setBakeries((prev) =>
        prev.map((b) =>
          b.status === "pending" ? { ...b, status: "approved" } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error approving multiple bakeries");
    }
  };

  // Filter — Search — Sort Logic
  const filtered = useMemo(() => {
    let list = [...bakeries];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          (b.name || "").toLowerCase().includes(q) ||
          (b.address || "").toLowerCase().includes(q) ||
          (b.ownerId?.name || "").toLowerCase().includes(q) ||
          (b.ownerId?.email || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [bakeries, query, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Analytics data
  const stats = useMemo(() => {
    const approved = bakeries.filter((b) => b.status === "approved").length;
    const pending = bakeries.filter((b) => b.status === "pending").length;
    const rejected = bakeries.filter((b) => b.status === "rejected").length;

    const pieData = [
      { name: "Approved", value: approved, key: "approved" },
      { name: "Pending", value: pending, key: "pending" },
      { name: "Rejected", value: rejected, key: "rejected" },
    ];

    const monthsMap = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthsMap[key] = 0;
    }

    bakeries.forEach((b) => {
      const d = new Date(b.createdAt);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (monthsMap[key] !== undefined) {
        monthsMap[key]++;
      }
    });

    const barData = Object.entries(monthsMap).map(([name, count]) => ({
      name,
      count,
    }));

    return { pieData, barData, counts: { approved, pending, rejected } };
  }, [bakeries]);

  // Loading Screen
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-yellow-50">
        <p className="text-pink-600 text-xl animate-pulse">
          Loading dashboard…
        </p>
      </div>
    );

  // MAIN UI
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl p-6 flex flex-col border-r">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">BakeHub</h1>

        <button className="flex items-center gap-3 p-2 text-gray-700 hover:text-pink-600">
          <Home size={18} /> Dashboard
        </button>
        <button className="flex items-center gap-3 p-2 text-gray-700 hover:text-pink-600">
          <Store size={18} /> Bakeries
        </button>

        <button
          className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 mt-auto"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <LogOut size={18} /> Logout
        </button>

        {/* Approve All */}
        <button
          onClick={handleApproveAllPending}
          className="w-full mt-4 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> Approve All Pending
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Manage Bakery Approvals & Platform Statistics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search bakery, address, owner…"
                className="pl-10 pr-4 py-2 w-72 rounded-lg border shadow-sm"
              />
              <SearchIcon className="absolute left-3 top-2 text-gray-400" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 border rounded-lg shadow-sm"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 border rounded-lg shadow-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name A→Z</option>
            </select>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="p-4 mb-4 bg-red-50 text-red-700 border border-red-100 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Pie Chart */}
          <div className="bg-white shadow-lg p-6 rounded-xl border">
            <h3 className="text-gray-700 text-sm mb-3 font-semibold">
              Bakery Status Distribution
            </h3>

            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    innerRadius={30}
                    paddingAngle={4}
                    label
                  >
                    {stats.pieData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-span-2 bg-white shadow-lg p-6 rounded-xl border">
            <h3 className="text-gray-700 text-sm mb-3 font-semibold">
              New Bakery Registrations (Last 6 Months)
            </h3>

            <div style={{ height: 230 }}>
              <ResponsiveContainer>
                <BarChart data={stats.barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bakery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pageData.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow-lg rounded-xl border overflow-hidden"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={
                    b.imageUrl ||
                    "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&w=800"
                  }
                  alt={b.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold">{b.name}</h3>
                <p className="text-gray-600 mt-1">{b.address}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Owner: {b.ownerId?.name || "—"} ({b.ownerId?.email || "—"})
                </p>

                <div className="mt-4">
                  {b.status === "approved" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 w-fit">
                      <CheckCircle size={16} /> Approved
                    </span>
                  )}
                  {b.status === "pending" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg flex items-center gap-2 w-fit">
                      <Clock size={16} /> Pending
                    </span>
                  )}
                  {b.status === "rejected" && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 w-fit">
                      <XCircle size={16} /> Rejected
                    </span>
                  )}
                </div>

                {/* Buttons */}
                {b.status === "pending" && (
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleApprove(b._id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(b._id)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-10">
          <span className="text-gray-600 text-sm">
            Showing {Math.min(filtered.length, (page - 1) * PAGE_SIZE + 1)} -{" "}
            {Math.min(filtered.length, page * PAGE_SIZE)} of {filtered.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white shadow"
            >
              <ChevronLeft />
            </button>

            <span className="px-3 py-1 bg-white rounded-lg shadow text-sm">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-white shadow"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
