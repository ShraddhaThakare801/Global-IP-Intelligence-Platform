import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function UserWatchlistPage() {

  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/subscriptions");
      setSubscriptions(res.data);
    } catch {
      toast.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (lensId) => {
    try {
      await api.delete(`/api/subscriptions/${lensId}`);
      setSubscriptions(prev => prev.filter(s => s.lensId !== lensId));
      toast.success("Removed from watchlist!");
    } catch {
      toast.error("Failed to remove.");
    }
  };

  return (

    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold gradient-text">
          ⭐ My Watchlist
        </h1>

        <button onClick={fetchSubscriptions} className="btn">
          ↻ Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && subscriptions.length === 0 && (
        <div className="glass-card text-center py-16">

          <p className="text-gray-400 text-lg mb-3">
            No patents in your watchlist
          </p>

          <p className="text-gray-500 mb-6">
            Subscribe to patents to track updates
          </p>

          <button
            onClick={() => navigate("/user/search")}
            className="btn glow-indigo"
          >
            Go to Search
          </button>

        </div>
      )}

      {/* GRID */}
      {!loading && subscriptions.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {subscriptions.map(p => (

            <div key={p.lensId} className="card">

              {/* TITLE */}
              <h3 className="title">{p.title || "Untitled Patent"}</h3>

              {/* INFO */}
              <p className="meta">🌍 {p.jurisdiction || "N/A"}</p>
              <p className="meta">📅 {p.datePub || "N/A"}</p>

              <p className="meta-small">
                Subscribed:{" "}
                {p.subscribedAt
                  ? new Date(p.subscribedAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>

              <p className="id">{p.lensId}</p>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => navigate(`/user/patent/${p.lensId}`, {
                    state: {
                      patent: {
                        lensId: p.lensId,
                        title: p.title,
                        jurisdiction: p.jurisdiction,
                        datePublished: p.datePub,
                      }
                    }
                  })}
                  className="btn glow-indigo flex-1"
                >
                  View
                </button>

                <button
                  onClick={() => handleUnsubscribe(p.lensId)}
                  className="btn glow-red flex-1"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* STYLE */}
      <style jsx>{`

        .gradient-text {
          background: linear-gradient(to right,#6366f1,#9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
        }

        .card {
          background:#020617;
          padding:20px;
          border-radius:15px;
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-5px);
          box-shadow:0 0 30px rgba(99,102,241,0.4);
        }

        .title {
          color:#c7d2fe;
          font-weight:600;
          margin-bottom:10px;
        }

        .meta {
          font-size:14px;
          color:#9ca3af;
        }

        .meta-small {
          font-size:12px;
          color:#6b7280;
        }

        .id {
          font-size:10px;
          color:#6b7280;
          margin-top:5px;
        }

        .btn {
          padding:10px;
          border-radius:10px;
          background:#1e293b;
          transition:0.3s;
        }

        .btn:hover {
          transform:scale(1.05);
        }

        .glow-indigo {
          box-shadow:0 0 10px #6366f1;
        }

        .glow-red {
          box-shadow:0 0 10px #ef4444;
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