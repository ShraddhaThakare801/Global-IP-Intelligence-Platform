import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const STATUS_COLORS = {
  ACTIVE: "bg-green-500/20 text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  GRANTED: "bg-blue-500/20 text-blue-400",
  DISCONTINUED: "bg-red-500/20 text-red-400",
};

export default function UserSearchPage() {

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [inventor, setInventor] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("");

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (overridePage = 0) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    setPage(overridePage);
    try {
      const params = { q: keyword.trim(), type: "PATENT", page: overridePage, size: 20 };
      if (jurisdiction) params.jurisdiction = jurisdiction;
      const res = await api.get("/api/search", { params });
      setResults(res.data.results || []);
      setTotal(res.data.total ?? null);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword(""); setJurisdiction(""); setInventor("");
    setAssignee(""); setStatus("");
    setResults([]); setTotal(null); setPage(0); setSearched(false);
  };

  const filtered = results.filter(r =>
    (inventor === "" || r.inventors?.some(i => i.toLowerCase().includes(inventor.toLowerCase()))) &&
    (assignee === "" || r.applicants?.some(a => a.toLowerCase().includes(assignee.toLowerCase()))) &&
    (status === "" || r.patentStatus === status)
  );

  const PATENT_STATUSES = ["ACTIVE", "PENDING", "GRANTED", "DISCONTINUED"];

  const availableStatuses = results.length > 0
    ? [...new Set(results.map(r => r.patentStatus).filter(Boolean))].sort()
    : PATENT_STATUSES;

  return (

    <div className="min-h-screen px-6 md:px-10 py-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold gradient-text">
          🔍 Patent Search
        </h1>
        <p className="text-gray-400">Search global innovation database</p>
      </div>

      {/* SEARCH PANEL */}
      <div className="glass-card space-y-4">

        <div className="flex gap-3 flex-wrap">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search(0)}
            placeholder="Search patents (AI, Robotics, Blockchain...)"
            className="input flex-1"
          />

          <button
            onClick={() => search(0)}
            disabled={loading || !keyword.trim()}
            className="btn-primary"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button onClick={handleClear} className="btn-secondary">
            Clear
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-3">

          <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="input">
            <option value="">All Countries</option>
            <option value="US">US</option>
            <option value="IN">IN</option>
            <option value="CN">CN</option>
            <option value="EP">EP</option>
            <option value="WO">WO</option>
          </select>

          <input value={inventor} onChange={e => setInventor(e.target.value)} placeholder="Inventor" className="input"/>
          <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Applicant" className="input"/>

          <select value={status} onChange={e => setStatus(e.target.value)} className="input">
            <option value="">All Status</option>
            {availableStatuses.map(s => <option key={s}>{s}</option>)}
          </select>

        </div>

      </div>

      {/* RESULTS */}
      {filtered.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(p => (

            <div key={p.lensId} className="card" onClick={() => navigate(`/user/patent/${p.lensId}`, { state: { patent: p } })}>

              <div className="flex justify-between mb-3">
                <span className="badge-type">{p.publicationType}</span>
                <span className={`badge-status ${STATUS_COLORS[p.patentStatus]}`}>
                  {p.patentStatus}
                </span>
              </div>

              <h3 className="title">{p.title}</h3>

              <p className="meta">Applicant: {p.applicants?.[0]}</p>
              <p className="meta">Inventor: {p.inventors?.[0]}</p>

              <p className="meta-small">
                {p.jurisdiction} • {p.datePublished}
              </p>

            </div>

          ))}

        </div>
      )}

      {/* STYLE */}
      <style jsx>{`

        .gradient-text {
          background: linear-gradient(to right,#6366f1,#9333ea,#ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:20px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
        }

        .input {
          background:#020617;
          padding:10px;
          border-radius:10px;
          border:1px solid #334155;
        }

        .btn-primary {
          background:#6366f1;
          padding:10px 20px;
          border-radius:10px;
        }

        .btn-secondary {
          background:#1e293b;
          padding:10px 20px;
          border-radius:10px;
        }

        .card {
          background:#020617;
          padding:20px;
          border-radius:16px;
          border:1px solid rgba(255,255,255,0.05);
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-5px);
          box-shadow:0 0 30px rgba(99,102,241,0.4);
        }

        .title {
          color:#c7d2fe;
          font-weight:600;
        }

        .meta {
          color:#9ca3af;
          font-size:14px;
        }

        .meta-small {
          color:#6b7280;
          font-size:12px;
        }

        .badge-type {
          font-size:10px;
          background:#1e293b;
          padding:3px 8px;
          border-radius:999px;
        }

        .badge-status {
          font-size:10px;
          padding:3px 8px;
          border-radius:999px;
        }

      `}</style>

    </div>
  );
}