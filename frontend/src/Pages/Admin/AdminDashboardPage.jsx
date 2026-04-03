import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const u = await api.get("/api/admin/users");
      const p = await api.get("/api/admin/analysts/pending");

      setUsers(u.data);
      setPending(p.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = () => {
    navigate("/admin/users");
  };

  const handleApprove = () => {
    navigate("/admin/approvals");
  };

  /* 🔥 LOADING UI (Shimmer) */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-pulse text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold gradient-text">
          🛠 Admin Dashboard
        </h1>

        <p className="text-gray-400">
          Manage users and platform activity
        </p>

        <p className="text-xs text-gray-500">
          Last Updated: {lastUpdated}
        </p>

        <button
          onClick={fetchData}
          className="mt-3 px-4 py-1 bg-indigo-600 rounded hover:bg-indigo-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* USERS */}
        <div className="card hover-indigo">
          <p className="label">Total Users</p>
          <h2 className="value text-indigo-400">{users.length}</h2>
          <p className="desc">All registered users</p>
        </div>

        {/* PENDING */}
        <div className="card hover-yellow">
          <p className="label">Pending Requests</p>
          <h2 className="value text-yellow-400">{pending.length}</h2>
          <p className="desc">Awaiting approval</p>
        </div>

        {/* ACTIVE USERS (NEW) */}
        <div className="card hover-green">
          <p className="label">Active Users</p>
          <h2 className="value text-green-400">
            {users.filter(u => u.active).length}
          </h2>
          <p className="desc">Currently active users</p>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="glass-card">
        <h3 className="section-title">Quick Actions</h3>

        <div className="flex gap-4 flex-wrap">

          <button onClick={handleViewUser} className="btn glow-indigo">
            👥 View Users
          </button>

          <button onClick={handleApprove} className="btn glow-yellow">
            ✅ Approve Analysts
          </button>

        </div>
      </div>

      {/* EMPTY STATE */}
      {users.length === 0 && (
        <div className="text-center text-gray-500">
          No users found 😢
        </div>
      )}

      {/* STYLE */}
      <style jsx>{`

        .gradient-text {
          background: linear-gradient(to right,#6366f1,#9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
          text-align:center;
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-6px) scale(1.02);
        }

        .hover-indigo:hover {
          box-shadow:0 0 40px rgba(99,102,241,0.4);
        }

        .hover-yellow:hover {
          box-shadow:0 0 40px rgba(245,158,11,0.4);
        }

        .hover-green:hover {
          box-shadow:0 0 40px rgba(34,197,94,0.4);
        }

        .label {
          color:#9ca3af;
          font-size:14px;
        }

        .value {
          font-size:36px;
          font-weight:bold;
        }

        .desc {
          color:#6b7280;
          font-size:12px;
        }

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
        }

        .section-title {
          color:#818cf8;
          margin-bottom:10px;
        }

        .btn {
          padding:10px 20px;
          border-radius:10px;
          background:#1e293b;
          transition:0.3s;
        }

        .btn:hover {
          transform:scale(1.08);
        }

        .glow-indigo {
          box-shadow:0 0 15px #6366f1;
        }

        .glow-yellow {
          box-shadow:0 0 15px #f59e0b;
        }

      `}</style>
    </div>
  );
}