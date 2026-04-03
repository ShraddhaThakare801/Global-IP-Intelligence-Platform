// ONLY UI IMPROVED — LOGIC SAME

import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AnalystSearchPage() {

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    jurisdiction: "",
    applicant: "",
    inventor: "",
    status: "",
    publicationType: ""
  });

  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    applyFilters(updated, allData);
  };

  const applyFilters = (filters, data) => {
    let filtered = [...data];

    if (filters.jurisdiction)
      filtered = filtered.filter(p => p.jurisdiction === filters.jurisdiction);

    if (filters.applicant)
      filtered = filtered.filter(p =>
        p.applicants?.join(" ").toLowerCase()
          .includes(filters.applicant.toLowerCase())
      );

    if (filters.inventor)
      filtered = filtered.filter(p =>
        p.inventors?.join(" ").toLowerCase()
          .includes(filters.inventor.toLowerCase())
      );

    if (filters.status)
      filtered = filtered.filter(p => p.patentStatus === filters.status);

    if (filters.publicationType)
      filtered = filtered.filter(p => p.publicationType === filters.publicationType);

    setResults(filtered);
    setCurrentPage(1);
  };

  const handleSearch = async () => {

    if (!filters.keyword.trim()) {
      alert("Enter keyword");
      return;
    }

    setLoading(true);

    try {

      const res = await api.get("/api/search", {
        params: {
          q: filters.keyword,
          type: "PATENT",
          page: 0,
          size: 30
        }
      });

      const data = res.data.results || [];

      setAllData(data);
      applyFilters(filters, data);

    } catch (err) {
      alert("API Error");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      jurisdiction: "",
      applicant: "",
      inventor: "",
      status: "",
      publicationType: ""
    });
    setResults([]);
    setAllData([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500/20 text-green-400";
      case "PENDING": return "bg-yellow-500/20 text-yellow-400";
      case "DISCONTINUED": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const start = (currentPage - 1) * itemsPerPage;
  const currentData = results.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (

    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🔍 Patent Intelligence Search
        </h1>
        <p className="text-gray-400 mt-2">Explore global innovation data</p>
      </div>

      {/* FILTER CARD */}
      <div className="glass-card grid md:grid-cols-3 gap-4">

        <input name="keyword" value={filters.keyword} onChange={handleChange} placeholder="Keyword..." className="input" />
        <input name="applicant" value={filters.applicant} onChange={handleChange} placeholder="Company" className="input" />
        <input name="inventor" value={filters.inventor} onChange={handleChange} placeholder="Inventor" className="input" />

        <select name="jurisdiction" value={filters.jurisdiction} onChange={handleChange} className="input">
          <option value="">Country</option>
          <option value="US">US</option>
          <option value="CN">China</option>
          <option value="WO">WIPO</option>
          <option value="KR">Korea</option>
        </select>

        <select name="status" value={filters.status} onChange={handleChange} className="input">
          <option value="">Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="DISCONTINUED">Discontinued</option>
        </select>

        <select name="publicationType" value={filters.publicationType} onChange={handleChange} className="input">
          <option value="">Type</option>
          <option value="PATENT_APPLICATION">Application</option>
          <option value="GRANTED_PATENT">Granted</option>
        </select>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={handleSearch} className="btn glow-indigo">🔎 Search</button>
        <button onClick={clearFilters} className="btn glow-red">Reset</button>

        <button
          onClick={() => {
            if (!results.length) return alert("Search first!");
            navigate("/analyst/export", { state: { results } });
          }}
          className="btn glow-green"
        >
          ⬇ Export
        </button>

        <button
          onClick={() => {
            if (!results.length) return alert("Search first!");
            navigate("/analyst/visualization", { state: { results } });
          }}
          className="btn glow-purple"
        >
          📊 Dashboard
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-indigo-400 animate-pulse">
          Loading data...
        </div>
      )}

      {/* RESULTS */}
      <div className="grid md:grid-cols-3 gap-6">

        {currentData.map((p) => (

          <div
            key={p.lensId}
            className="card group"
            onClick={() =>
              navigate(`/analyst/patent/${p.lensId}`, { state: { patent: p } })
            }
          >

            <div className="card-glow"></div>

            <h3 className="title">{p.title}</h3>

            <p className="meta">{p.applicants?.join(", ")}</p>

            <p className="meta">
              {p.jurisdiction} • {p.datePublished}
            </p>

            <span className={`badge ${getStatusColor(p.patentStatus)}`}>
              {p.patentStatus}
            </span>

          </div>

        ))}

      </div>

      {/* PAGINATION */}
      {results.length > 0 && (
        <div className="flex justify-center items-center gap-4">

          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="btn">
            Prev
          </button>

          <span className="text-indigo-400 font-bold">
            {currentPage} / {totalPages}
          </span>

          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="btn">
            Next
          </button>

        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .glass-card {
          background: rgba(15,23,42,0.7);
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

        .btn {
          padding:10px 20px;
          border-radius:10px;
          background:#1e293b;
          transition:0.3s;
        }

        .btn:hover { transform: scale(1.05); }

        .glow-indigo { box-shadow:0 0 15px #6366f1; }
        .glow-red { box-shadow:0 0 15px #ef4444; }
        .glow-green { box-shadow:0 0 15px #10b981; }
        .glow-purple { box-shadow:0 0 15px #9333ea; }

        .card {
          background:rgba(30,41,59,0.6);
          padding:20px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
          transition:0.3s;
          position:relative;
          cursor:pointer;
        }

        .card:hover {
          transform:translateY(-8px);
          box-shadow:0 0 40px rgba(99,102,241,0.6);
        }

        .title {
          color:#818cf8;
          font-weight:bold;
          margin-bottom:10px;
        }

        .meta {
          color:#9ca3af;
          font-size:14px;
        }

        .badge {
          margin-top:10px;
          display:inline-block;
          padding:4px 10px;
          border-radius:999px;
          font-size:12px;
        }
      `}</style>

    </div>
  );
}