import { useState, useMemo } from "react";
import { getUser } from "../utils/auth";
import ChartsSection from "../components/analyst/ChartsSection";
import Pagination from "../components/analyst/Pagination";
import SortControls from "../components/analyst/SortControls";
import ExportMenu from "../components/analyst/ExportMenu";

export default function AnalystDashboard() {
  const user = getUser();

  if (!user || user.role !== "ANALYST") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Access Denied
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState("overview");

  const [filings] = useState([
    {
      id: 1,
      type: "Patent",
      status: "Active",
      jurisdiction: "USPTO",
      inventor: "John Smith",
      assignee: "Tesla Inc",
      keyword: "Electric Battery",
      filingDate: "2024-01-15",
    },
    {
      id: 2,
      type: "Trademark",
      status: "Pending",
      jurisdiction: "WIPO",
      inventor: "Maria Garcia",
      assignee: "Nike",
      keyword: "Smart Shoes",
      filingDate: "2024-02-10",
    },
    {
      id: 3,
      type: "Patent",
      status: "Expired",
      jurisdiction: "EPO",
      inventor: "Akira Tanaka",
      assignee: "Sony",
      keyword: "AI Camera",
      filingDate: "2024-03-20",
    },
    {
      id: 4,
      type: "Design",
      status: "Active",
      jurisdiction: "TMview",
      inventor: "Elena Fischer",
      assignee: "Adidas",
      keyword: "Sport Apparel",
      filingDate: "2024-04-05",
    },
    {
      id: 5,
      type: "Patent",
      status: "Pending",
      jurisdiction: "USPTO",
      inventor: "Rohit Mehta",
      assignee: "Infosys",
      keyword: "Cloud Optimization",
      filingDate: "2024-05-12",
    },
    {
      id: 6,
      type: "Trademark",
      status: "Active",
      jurisdiction: "EPO",
      inventor: "Sara Kim",
      assignee: "Samsung",
      keyword: "Smart Display",
      filingDate: "2024-06-01",
    },
  ]);

  const [keyword, setKeyword] = useState("");
  const [inventor, setInventor] = useState("");
  const [assignee, setAssignee] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");

  const filteredData = useMemo(() => {
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

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    if (sortField) {
      sorted.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortField, sortOrder]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b1220] via-[#111827] to-[#0f172a] text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            IP Intel
          </h2>

          <SidebarItem
            label="📊 Overview"
            active={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
          />
          <SidebarItem
            label="📁 Filings"
            active={activeSection === "filings"}
            onClick={() => setActiveSection("filings")}
          />
          <SidebarItem
            label="📄 Reports"
            active={activeSection === "reports"}
            onClick={() => setActiveSection("reports")}
          />
        </div>

        <div className="text-xs text-gray-400">
          Logged in as <span className="text-indigo-400">{user.username}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Analyst Dashboard
          </h1>
        </div>

        {activeSection === "overview" && (
          <div className="animate-fadeIn">
            <ChartsSection data={filteredData} />
          </div>
        )}

        {activeSection === "filings" && (
          <>
            {/* FILTER CARD */}
            <div className="mb-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
              <h3 className="text-lg font-semibold mb-6 text-indigo-400">
                Advanced Filters
              </h3>

              <div className="grid md:grid-cols-4 gap-6">
                <Input
                  placeholder="Keyword"
                  value={keyword}
                  onChange={setKeyword}
                />
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

                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Jurisdictions</option>
                  <option value="USPTO">USPTO</option>
                  <option value="EPO">EPO</option>
                  <option value="WIPO">WIPO</option>
                  <option value="TMview">TMview</option>
                </select>
              </div>
            </div>

            {/* SORT + EXPORT */}
            <div className="flex justify-between items-center mb-6">
              <SortControls
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              <ExportMenu data={sortedData} />
            </div>

            {/* TABLE */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="py-3 text-left">Type</th>
                    <th>Status</th>
                    <th>Jurisdiction</th>
                    <th>Inventor</th>
                    <th>Assignee</th>
                    <th>Keyword</th>
                    <th>Filing Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <td className="py-3">{f.type}</td>
                      <td>{f.status}</td>
                      <td>{f.jurisdiction}</td>
                      <td>{f.inventor}</td>
                      <td>{f.assignee}</td>
                      <td>{f.keyword}</td>
                      <td>{f.filingDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                totalItems={sortedData.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </>
        )}

        {activeSection === "reports" && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-indigo-400">
              Reports & Export
            </h2>
            <ExportMenu data={sortedData} />
          </div>
        )}
      </div>
    </div>
  );
}

const SidebarItem = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`px-4 py-3 rounded-xl mb-4 cursor-pointer transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
        : "hover:bg-white/10"
    }`}
  >
    {label}
  </div>
);

const Input = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
  />
);
