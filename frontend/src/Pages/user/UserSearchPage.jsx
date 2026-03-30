import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const STATUS_COLORS = {
  ACTIVE: "bg-green-600",
  PENDING: "bg-yellow-500",
  GRANTED: "bg-blue-600",
  DISCONTINUED: "bg-red-600",
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

  // Client-side filters on top of API results
  const filtered = results.filter(r =>
    (inventor === "" || r.inventors?.some(i => i.toLowerCase().includes(inventor.toLowerCase()))) &&
    (assignee === "" || r.applicants?.some(a => a.toLowerCase().includes(assignee.toLowerCase()))) &&
    (status === "" || r.patentStatus === status)
  );

  const PATENT_STATUSES = ["ACTIVE", "PENDING", "GRANTED", "DISCONTINUED"];

  // Before search → show all defaults. After search → show only what's in results
  const availableStatuses = results.length > 0
    ? [...new Set(results.map(r => r.patentStatus).filter(Boolean))].sort()
    : PATENT_STATUSES;

  return (

    <div className="space-y-10 text-white">

      {/* TITLE */}
      <h1 className="
        text-4xl
        font-extrabold
        bg-gradient-to-r
        from-indigo-400
        to-purple-500
        bg-clip-text
        text-transparent
      ">
        Patent Search
      </h1>


      {/* SEARCH PANEL */}
      <div className="
        bg-slate-800
        border border-slate-700
        p-6
        rounded-3xl
        shadow-2xl
        hover:shadow-indigo-500/20
        transition
        space-y-4
      ">

        {/* Row 1 — keyword (full width) + Search button */}
        <div className="flex gap-3">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search(0)}
            className="
              flex-1
              bg-slate-900 border border-slate-700
              px-6 py-4 text-lg rounded-2xl text-white
              placeholder-gray-400 outline-none
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition
            "
            placeholder="Search patents (AI, Robotics, Blockchain...)"
          />
          <button
            onClick={() => search(0)}
            disabled={loading || !keyword.trim()}
            className="
              bg-indigo-600 px-8 py-4 text-base rounded-2xl font-semibold
              shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/40
              transition disabled:opacity-50 whitespace-nowrap
            "
          >
            {loading ? "Searching…" : "Search"}
          </button>
          <button
            onClick={handleClear}
            className="border border-gray-600 px-5 py-4d rounded-2xl hover:bg-slate-700 transition text-gray-300 whitespace-nowrap"
          >
            Clear
          </button>
        </div>

        {/* Row 2 — Jurisdiction | Inventor | Assignee | Status — equal grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* Jurisdiction */}
          <div className="relative">
            <select
              value={jurisdiction}
              onChange={e => setJurisdiction(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-700 px-4 py-3 pr-9 rounded-xl text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition cursor-pointer"
            >
              <option value="">All Jurisdictions</option>
              <option value="US">US</option>
              <option value="IN">IN</option>
              <option value="CN">CN</option>
              <option value="EP">EP</option>
              <option value="WO">WO (PCT)</option>
              <option value="KR">KR</option>
              <option value="JP">JP</option>
              <option value="DE">DE</option>
              <option value="GB">GB</option>
            </select>
            <ChevronIcon />
          </div>

          {/* Inventor */}
          <input
            value={inventor}
            onChange={e => setInventor(e.target.value)}
            placeholder="Inventor"
            className="bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition"
          />

          {/* Assignee */}
          <input
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            placeholder="Assignee / Applicant"
            className="bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition"
          />

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-700 px-4 py-3 pr-9 rounded-xl text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition cursor-pointer"
            >
              <option value="">All Statuses</option>
              {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronIcon />
          </div>

        </div>

      </div>


      {/* RESULT COUNT */}
      {searched && !loading && (
        <p className="text-gray-400 text-sm">
          {total !== null
            ? `Showing ${page * 20 + 1}–${page * 20 + filtered.length} of ${total.toLocaleString()} total patents`
            : `Showing ${filtered.length} results`}
        </p>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-gray-500 text-center py-10">No patents found. Try a different keyword.</p>
      )}


      {/* RESULTS GRID */}
      {filtered.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map(p => (
              <div
                key={p.lensId}
                onClick={() => navigate(`/user/patent/${p.lensId}`, { state: { patent: p } })}
                className="
                  bg-slate-800 border border-slate-700
                  p-6 rounded-2xl shadow-xl
                  hover:-translate-y-2 hover:shadow-indigo-500/40 hover:border-indigo-500
                  transition cursor-pointer group
                "
              >
                {/* Badges */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded">
                    {p.publicationType?.replace("_", " ")}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded text-white ${STATUS_COLORS[p.patentStatus] || "bg-gray-600"}`}>
                    {p.patentStatus}
                  </span>
                </div>

                <h3 className="
                  text-indigo-400 font-semibold text-base mb-3 line-clamp-2
                  group-hover:text-indigo-300 transition
                ">
                  {p.title}
                </h3>

                <p className="text-gray-400 text-sm mb-1">
                  Applicant: {p.applicants?.[0] || "N/A"}
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  Inventor: {p.inventors?.[0] || "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  {p.jurisdiction} &nbsp;|&nbsp; {p.datePublished}
                </p>

                <div className="mt-4 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                  View Patent →
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={page === 0 || loading}
              onClick={() => search(page - 1)}
              className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition"
            >
              ← Prev
            </button>
            <span className="text-gray-300 font-medium">
              Page {page + 1}{total !== null && ` of ${Math.ceil(total / 20).toLocaleString()}`}
            </span>
            <button
              disabled={results.length < 20 || loading}
              onClick={() => search(page + 1)}
              className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        </>
      )}

    </div>
  );
}

/* Custom dropdown arrow for select elements */
function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}