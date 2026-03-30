import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function UserWatchlistPage() {

  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subscriptions from real API on mount
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
      toast.success("Unsubscribed successfully!");
    } catch {
      toast.error("Failed to unsubscribe. Please try again.");
    }
  };

  return (

    <div className="space-y-10 text-white">


      {/* TITLE */}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="
        text-3xl
        font-extrabold
        bg-gradient-to-r
        from-indigo-400
        to-purple-500
        bg-clip-text
        text-transparent
        ">
          My Watchlist
        </h2>

        <button
          onClick={fetchSubscriptions}
          className="text-sm text-gray-400 hover:text-white border border-gray-600 px-3 py-1 rounded transition"
        >
          ↻ Refresh
        </button>
      </div>


      {/* LOADING */}

      {loading && (
        <p className="text-gray-400 animate-pulse">Loading subscriptions…</p>
      )}


      {/* EMPTY STATE */}

      {!loading && subscriptions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">No patents in watchlist.</p>
          <p className="text-gray-500 text-sm mb-6">
            Search for a patent, open its details, and click <span className="text-green-400">🔔 Subscribe</span>.
          </p>
          <button
            onClick={() => navigate("/user/search")}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition text-sm font-semibold"
          >
            Go to Search
          </button>
        </div>
      )}


      {/* WATCHLIST GRID */}

      {!loading && subscriptions.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {subscriptions.map(p => (

            <div
              key={p.lensId}
              className="
              bg-slate-800
              border border-slate-700
              p-6
              rounded-xl
              shadow-xl
              hover:-translate-y-1
              hover:shadow-indigo-500/30
              hover:border-indigo-500
              transition
              flex flex-col justify-between
              "
            >

              {/* TITLE */}

              <h3 className="text-indigo-400 font-semibold mb-3 line-clamp-2">
                {p.title || "Untitled Patent"}
              </h3>


              {/* INFO */}

              <p className="text-gray-400 text-sm">
                Jurisdiction: {p.jurisdiction || "N/A"}
              </p>

              <p className="text-gray-400 text-sm">
                Published: {p.datePub || "N/A"}
              </p>

              <p className="text-gray-500 text-sm mb-1">
                Subscribed:{" "}
                {p.subscribedAt
                  ? new Date(p.subscribedAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })
                  : "N/A"}
              </p>

              <p className="text-xs font-mono text-gray-600 mb-4 truncate">
                {p.lensId}
              </p>


              {/* ACTIONS */}

              <div className="flex gap-3 mt-auto">

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
                  className="
                  flex-1
                  bg-indigo-600
                  py-2
                  rounded-lg
                  hover:bg-indigo-700
                  shadow
                  hover:shadow-indigo-500/40
                  transition
                  text-sm
                  font-semibold
                  "
                >
                  View Details →
                </button>

                <button
                  onClick={() => handleUnsubscribe(p.lensId)}
                  className="
                  flex-1
                  bg-red-600
                  py-2
                  rounded-lg
                  hover:bg-red-700
                  shadow
                  hover:shadow-red-500/40
                  transition
                  text-sm
                  font-semibold
                  "
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>

  );

}