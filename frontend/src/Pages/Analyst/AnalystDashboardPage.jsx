import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function AnalystDashboardPage() {

  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState(localStorage.getItem("lastSearch") || "artificial intelligence");
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchPatents(search, page);
  }, [page]);

  const fetchPatents = async (keyword, pageNo = 0) => {
    setLoading(true);

    try {
      localStorage.setItem("lastSearch", keyword);

      const history = JSON.parse(localStorage.getItem("history")) || [];
      const updatedHistory = [keyword, ...history.filter(h => h !== keyword)].slice(0, 3);
      localStorage.setItem("history", JSON.stringify(updatedHistory));

      const response = await api.get("/api/search", {
        params: {
          q: keyword,
          type: "PATENT",
          page: pageNo,
          size: 30
        }
      });

      setPatents(response.data.results || []);

    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatents = useMemo(() => {
    if (filter === "ALL") return patents;
    return patents.filter(p => p.patentStatus === filter);
  }, [patents, filter]);

  const totalPatents = patents.length;
  const active = patents.filter(p => p.patentStatus === "ACTIVE").length;
  const pending = patents.filter(p => p.patentStatus === "PENDING").length;
  const discontinued = patents.filter(p => p.patentStatus === "DISCONTINUED").length;

  const statusData = useMemo(() => {
    const counts = {};
    patents.forEach(p => {
      const status = p.patentStatus || "UNKNOWN";
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [patents]);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];
  const history = JSON.parse(localStorage.getItem("history")) || [];

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          📊 Patent Intelligence Dashboard
        </h1>
        <p className="text-gray-400">AI-powered analytics & insights</p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patents..."
          className="input flex-1"
        />
        <button
          onClick={() => {
            setPage(0);
            fetchPatents(search, 0);
          }}
          className="btn glow-indigo"
        >
          Search
        </button>
      </div>

      {/* HISTORY */}
      <div className="flex gap-3 flex-wrap">
        {history.map((h, i) => (
          <span
            key={i}
            onClick={() => {
              setSearch(h);
              setPage(0);
              fetchPatents(h, 0);
            }}
            className="chip"
          >
            🔍 {h}
          </span>
        ))}
      </div>

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap">
        {["ALL", "ACTIVE", "PENDING", "DISCONTINUED"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? "active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {/* KPI */}
          <div className="grid md:grid-cols-4 gap-6">
            <GlassCard title="Total" value={totalPatents} />
            <GlassCard title="Active" value={active} />
            <GlassCard title="Pending" value={pending} />
            <GlassCard title="Discontinued" value={discontinued} />
          </div>

          {/* CHART + LIST */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* CHART */}
            <div className="glass-card">
              <h3 className="section-title">Status Distribution</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" outerRadius={110}>
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* LIST */}
            <div className="glass-card max-h-[450px] overflow-y-auto">
              <h3 className="section-title">Patent Records</h3>

              <div className="space-y-4">
                {filteredPatents.map(p => (
                  <div key={p.lensId} className="list-card">
                    <p className="font-semibold text-indigo-300">{p.title}</p>
                    <p className="text-sm text-gray-400">
                      {p.applicants?.[0]} • {p.jurisdiction}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.datePublished} • {p.patentStatus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="btn">
              ← Prev
            </button>

            <span className="text-indigo-400 font-bold">Page {page + 1}</span>

            <button onClick={() => setPage(p => p + 1)} className="btn">
              Next →
            </button>
          </div>
        </>
      )}

      {/* STYLE */}
      <style jsx>{`
        .input {
          padding:12px;
          border-radius:12px;
          background:#020617;
          border:1px solid #334155;
        }

        .btn {
          padding:12px 20px;
          border-radius:12px;
          background:#1e293b;
          transition:0.3s;
        }

        .btn:hover {
          transform:scale(1.05);
          background:#6366f1;
        }

        .glow-indigo {
          box-shadow:0 0 15px #6366f1;
        }

        .chip {
          padding:6px 14px;
          border-radius:999px;
          background:#1e293b;
          cursor:pointer;
        }

        .filter-btn {
          padding:8px 16px;
          border-radius:999px;
          background:#1e293b;
          transition:0.3s;
        }

        .filter-btn.active {
          background:linear-gradient(to right,#6366f1,#9333ea);
        }

        .glass-card {
          background:rgba(30,41,59,0.6);
          backdrop-filter:blur(25px);
          padding:20px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
        }

        .section-title {
          color:#818cf8;
          margin-bottom:10px;
        }

        .list-card {
          padding:15px;
          border-radius:12px;
          background:#020617;
          transition:0.3s;
        }

        .list-card:hover {
          transform:scale(1.02);
          box-shadow:0 0 20px rgba(99,102,241,0.4);
        }

        .loader {
          width:40px;
          height:40px;
          border:4px solid #6366f1;
          border-top:transparent;
          border-radius:50%;
          animation:spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform:rotate(360deg); }
        }
      `}</style>

    </div>
  );
}

function GlassCard({ title, value }) {
  return (
    <div className="glass-card hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-indigo-300">{value}</h3>
    </div>
  );
}