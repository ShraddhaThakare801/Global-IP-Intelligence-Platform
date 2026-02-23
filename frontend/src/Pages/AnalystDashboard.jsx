import { useState, useMemo } from "react";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AnalystDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const [filings] = useState([
    {
      id: 1,
      type: "Patent",
      status: "Active",
      jurisdiction: "USPTO",
      inventor: "John Smith",
      assignee: "Tesla Inc",
      keyword: "Electric Battery",
    },
    {
      id: 2,
      type: "Trademark",
      status: "Pending",
      jurisdiction: "WIPO",
      inventor: "Maria Garcia",
      assignee: "Nike",
      keyword: "Smart Shoes",
    },
    {
      id: 3,
      type: "Patent",
      status: "Expired",
      jurisdiction: "EPO",
      inventor: "Akira Tanaka",
      assignee: "Sony",
      keyword: "AI Camera",
    },
    {
      id: 4,
      type: "Design",
      status: "Active",
      jurisdiction: "TMview",
      inventor: "Elena Fischer",
      assignee: "Adidas",
      keyword: "Sport Apparel",
    },
  ]);

  const [keyword, setKeyword] = useState("");
  const [inventor, setInventor] = useState("");
  const [assignee, setAssignee] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");

  const filteredFilings = useMemo(() => {
    return filings.filter(
      (f) =>
        (keyword === "" ||
          f.keyword.toLowerCase().includes(keyword.toLowerCase())) &&
        (inventor === "" ||
          f.inventor.toLowerCase().includes(inventor.toLowerCase())) &&
        (assignee === "" ||
          f.assignee.toLowerCase().includes(assignee.toLowerCase())) &&
        (jurisdiction === "" || f.jurisdiction === jurisdiction)
    );
  }, [filings, keyword, inventor, assignee, jurisdiction]);

  const stats = useMemo(
    () => ({
      total: filteredFilings.length,
      active: filteredFilings.filter((f) => f.status === "Active").length,
      pending: filteredFilings.filter((f) => f.status === "Pending").length,
      expired: filteredFilings.filter((f) => f.status === "Expired").length,
    }),
    [filteredFilings]
  );

  if (!user || user.role !== "ANALYST") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Access Denied
      </div>
    );
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(filteredFilings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_filings.json";
    a.click();
    toast.success("Data exported successfully 🚀");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827] text-white p-8">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Analyst Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Welcome back, {user.username}</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Expired" value={stats.expired} />
      </div>

      {/* FILTERS */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">
          Advanced Filters
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <Input placeholder="Keyword" value={keyword} onChange={setKeyword} />
          <Input
            placeholder="Inventor"
            value={inventor}
            onChange={setInventor}
          />
          <Input
            placeholder="Assignee"
            value={assignee}
            onChange={setAssignee}
          />

          <div className="relative">
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="">All Jurisdictions</option>
              <option value="USPTO">USPTO</option>
              <option value="EPO">EPO</option>
              <option value="WIPO">WIPO</option>
              <option value="TMview">TMview</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        <button
          onClick={exportData}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:scale-105 transition transform"
        >
          Export Data
        </button>
      </div>

      {/* TABLE */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-indigo-400">
          IP Filings
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Jurisdiction</th>
                <th className="py-3 text-left">Inventor</th>
                <th className="py-3 text-left">Assignee</th>
                <th className="py-3 text-left">Keyword</th>
              </tr>
            </thead>

            <tbody>
              {filteredFilings.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3">{f.type}</td>
                  <td className="py-3">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="py-3">{f.jurisdiction}</td>
                  <td className="py-3">{f.inventor}</td>
                  <td className="py-3">{f.assignee}</td>
                  <td className="py-3">{f.keyword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

const Input = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
);

const StatCard = ({ label, value }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition transform">
    <p className="text-sm opacity-80">{label}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const color =
    status === "Active"
      ? "bg-green-500/20 text-green-400"
      : status === "Pending"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};
