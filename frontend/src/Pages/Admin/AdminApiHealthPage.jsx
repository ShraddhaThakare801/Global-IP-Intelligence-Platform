import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Activity, CheckCircle, XCircle, Loader2 } from "lucide-react";

// API Health Dashboard

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function AdminApiHealthPage() {
  const [health,    setHealth]    = useState(null);
  const [checking,  setChecking]  = useState(false);

  const fetchHealth = async () => {
    setChecking(true);
    try {
      const res = await api.get("/api/admin/health");
      setHealth(res.data);
    } catch (err) {
      setHealth({
        api: "lens",
        status: "DOWN",
        responseTimeMs: null,
        checkedAt: new Date().toISOString(),
        errorMessage: err?.response?.data?.message ?? "Could not reach backend",
      });
    } finally {
      setChecking(false);
    }
  };

  // Initial fetch + auto-refresh every 60 s
  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 60_000);
    return () => clearInterval(id);
  }, []);

  const isUp = health?.status === "UP";

    return (
  <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

    {/* HEADER */}
    <div className="flex items-center justify-between flex-wrap gap-4">

      <div className="flex items-center gap-3">
        <Activity size={26} className="text-indigo-400" />
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">
            API Health Monitor
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time system status
          </p>
        </div>
      </div>

      <button
        onClick={fetchHealth}
        disabled={checking}
        className="btn glow-indigo"
      >
        <Loader2 size={14} className={checking ? "animate-spin" : ""} />
        {checking ? "Checking…" : "Refresh"}
      </button>

    </div>

    {/* CARD */}
    <div className="glass-card">

      {checking && !health && (
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span>Pinging API…</span>
        </div>
      )}

      {health && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            <div className="logo-box">
              L
            </div>

            <div>
              <p className="text-lg font-bold text-white">Lens.org</p>
              <p className="text-sm text-gray-400">Patent API</p>
              <p className="text-xs text-gray-500 mt-1">
                Last checked {formatDate(health.checkedAt)}
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end gap-3">

            {/* STATUS */}
            <span className={`status ${isUp ? "up pulse" : "down"}`}>
              {isUp
                ? <CheckCircle size={15}/>
                : <XCircle size={15}/>}
              {health.status}
            </span>

            {/* RESPONSE */}
            {health.responseTimeMs != null && (
              <span className={`text-sm font-semibold ${
                health.responseTimeMs < 500 ? "text-emerald-400"
                : health.responseTimeMs < 1500 ? "text-yellow-400"
                : "text-red-400"
              }`}>
                {health.responseTimeMs} ms
              </span>
            )}

            {!isUp && health.errorMessage && (
              <p className="text-xs text-red-400 max-w-xs text-right">
                {health.errorMessage}
              </p>
            )}

            {checking && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Loader2 size={11} className="animate-spin"/> updating…
              </span>
            )}

          </div>

        </div>
      )}

    </div>

    {/* FOOTER NOTE */}
    <p className="text-xs text-gray-500 text-center max-w-xl mx-auto">
      Health is checked via live API ping. Fast response = stable system.
    </p>

    {/* STYLE */}
    <style jsx>{`

      .gradient-text {
        background: linear-gradient(to right,#6366f1,#9333ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .glass-card {
        background: rgba(30,41,59,0.6);
        backdrop-filter: blur(30px);
        padding:30px;
        border-radius:20px;
        border:1px solid rgba(255,255,255,0.08);
        box-shadow:0 0 40px rgba(0,0,0,0.4);
      }

      .logo-box {
        width:70px;
        height:70px;
        border-radius:20px;
        background:#020617;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:28px;
        font-weight:bold;
        color:#818cf8;
        box-shadow:0 0 20px rgba(99,102,241,0.4);
      }

      .status {
        display:flex;
        align-items:center;
        gap:6px;
        padding:6px 14px;
        border-radius:999px;
        font-size:13px;
        font-weight:bold;
      }

      .up {
        background:#10b98120;
        color:#10b981;
      }

      .down {
        background:#ef444420;
        color:#ef4444;
      }

      .pulse {
        animation:pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% { box-shadow:0 0 0 0 rgba(16,185,129,0.5); }
        70% { box-shadow:0 0 0 10px rgba(16,185,129,0); }
        100% { box-shadow:0 0 0 0 rgba(16,185,129,0); }
      }

      .btn {
        display:flex;
        align-items:center;
        gap:6px;
        padding:10px 18px;
        border-radius:10px;
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

    `}</style>

  </div>
);
}