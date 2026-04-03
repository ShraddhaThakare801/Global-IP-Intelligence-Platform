import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { ScrollText, Loader2 } from "lucide-react";

// Activity Logs Page

const ACTION_COLORS = {
  ANALYST_APPROVED:     "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  ANALYST_REJECTED:     "bg-red-500/20    text-red-300    border border-red-500/30",
  USER_REGISTERED:      "bg-blue-500/20   text-blue-300   border border-blue-500/30",
  ADMIN_LOGIN:          "bg-violet-500/20 text-violet-300  border border-violet-500/30",
  SUBSCRIPTION_CREATED: "bg-amber-500/20  text-amber-300  border border-amber-500/30",
  SUBSCRIPTION_DELETED: "bg-slate-500/20  text-slate-300  border border-slate-500/30",
};

const ACTION_OPTIONS = [
  "ALL",
  "ADMIN_LOGIN",
  "USER_REGISTERED",
  "ANALYST_APPROVED",
  "ANALYST_REJECTED",
  "SUBSCRIPTION_CREATED",
  "SUBSCRIPTION_DELETED",
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function AdminLogsPage() {
  const [logs,        setLogs]        = useState([]);
  const [logTotal,    setLogTotal]    = useState(0);
  const [logPage,     setLogPage]     = useState(0);
  const [totalPages,  setTotalPages]  = useState(0);
  const [action,      setAction]      = useState("ALL");
  const [loading,     setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchLogs = async (page, act, reset = false) => {
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const params = { page, size: 20 };
      if (act && act !== "ALL") params.action = act;

      const res = await api.get("/api/admin/logs", { params });
      const data = res.data;

      setLogs(prev => reset ? data.content : [...prev, ...data.content]);
      setLogTotal(data.totalElements);
      setLogPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load activity logs");
    } finally {
      reset ? setLoading(false) : setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => { fetchLogs(0, action, true); }, []);

  // Re-fetch when filter changes
  useEffect(() => { fetchLogs(0, action, true); }, [action]);

    return (
  <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

    {/* HEADER */}
    <div className="flex flex-wrap items-center justify-between gap-4">

      <div className="flex items-center gap-3">
        <ScrollText size={26} className="text-indigo-400" />
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">
            Activity Logs
          </h1>
          <p className="text-gray-400 text-sm">
            {logTotal.toLocaleString()} total events tracked
          </p>
        </div>
      </div>

      {/* FILTER */}
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="filter"
      >
        {ACTION_OPTIONS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

    </div>

    {/* TABLE CARD */}
    <div className="glass-card">

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading logs…
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No activity logs found
        </div>
      ) : (
        <>
          <div className="overflow-x-auto max-h-[500px] custom-scroll">

            <table className="w-full text-sm">

              <thead className="sticky top-0 bg-slate-900 z-10 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Time</th>
                  <th className="px-5 py-3 text-left">Action</th>
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Entity</th>
                  <th className="px-5 py-3 text-left">Details</th>
                </tr>
              </thead>

              <tbody>

                {logs.map((entry) => (

                  <tr
                    key={entry.id}
                    className="row"
                  >

                    <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(entry.timestamp)}
                    </td>

                    <td className="px-5 py-3">
                      <span className={`badge ${ACTION_COLORS[entry.action] || "bg-gray-600/30 text-gray-300"}`}>
                        {entry.action}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-gray-200 font-medium">
                      {entry.performedBy ?? "—"}
                    </td>

                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {entry.entityType && entry.entityId
                        ? `${entry.entityType} #${entry.entityId}`
                        : (entry.entityType ?? "—")}
                    </td>

                    <td className="px-5 py-3 text-gray-400 text-xs truncate max-w-xs">
                      {entry.details ?? "—"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* LOAD MORE */}
          {logPage + 1 < totalPages && (
            <div className="text-center mt-6">

              <button
                onClick={() => fetchLogs(logPage + 1, action, false)}
                disabled={loadingMore}
                className="btn glow-indigo"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Loading…
                  </span>
                ) : (
                  `Load More (${logTotal - logs.length} left)`
                )}
              </button>

            </div>
          )}
        </>
      )}

    </div>

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
        border-radius:20px;
        padding:20px;
        border:1px solid rgba(255,255,255,0.08);
      }

      .row {
        border-bottom:1px solid rgba(255,255,255,0.05);
        transition:0.3s;
      }

      .row:hover {
        background:rgba(99,102,241,0.08);
      }

      .badge {
        padding:4px 10px;
        border-radius:999px;
        font-size:11px;
        font-weight:600;
      }

      .filter {
        background:#020617;
        border:1px solid #334155;
        padding:8px 12px;
        border-radius:10px;
      }

      .btn {
        padding:10px 20px;
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

      .custom-scroll::-webkit-scrollbar {
        width:6px;
      }

      .custom-scroll::-webkit-scrollbar-thumb {
        background:#6366f1;
        border-radius:10px;
      }

    `}</style>

  </div>
);
}