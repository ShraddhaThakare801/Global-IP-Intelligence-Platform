import { useLocation } from "react-router-dom";
import { useMemo, useState, useRef } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  Tooltip, Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";

export default function AnalystVisualizationPage() {

  const location = useLocation();
  const rawData = location.state?.results || [];

  const [tool, setTool] = useState("trend");
  const [yearFilter, setYearFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const chartRef = useRef();

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    return rawData.filter(p => {
      const year = new Date(p.datePublished).getFullYear();

      if (yearFilter !== "all" && year !== Number(yearFilter)) return false;
      if (countryFilter !== "all" && p.jurisdiction !== countryFilter) return false;

      return true;
    });
  }, [rawData, yearFilter, countryFilter]);

  /* ================= KPI ================= */

  const totalPatents = filteredData.length;

  const uniqueCountries = new Set(filteredData.map(p => p.jurisdiction)).size;

  const uniqueApplicants = new Set(
    filteredData.flatMap(p => p.applicants || [])
  ).size;

  const latestYear = filteredData.length
    ? Math.max(...filteredData.map(p => new Date(p.datePublished).getFullYear()))
    : 0;

  /* ================= TRANSFORMS ================= */

  // Trend
  const trendData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      const year = new Date(p.datePublished).getFullYear();
      map[year] = (map[year] || 0) + 1;
    });
    return Object.entries(map).map(([year, count]) => ({ year, count }));
  }, [filteredData]);

  // Growth
  const growthData = trendData.map((d,i,arr)=>({
    year: d.year,
    growth: i===0 ? 0 : d.count - arr[i-1].count
  }));

  // Country
  const countryData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      map[p.jurisdiction] = (map[p.jurisdiction] || 0) + 1;
    });
    return Object.entries(map).map(([country, count]) => ({ country, count }));
  }, [filteredData]);

  // Status
  const statusData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      map[p.patentStatus] = (map[p.patentStatus] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Publication Type
  const typeData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      map[p.publicationType] = (map[p.publicationType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Applicants
  const applicantData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      p.applicants?.forEach(a => {
        map[a] = (map[a] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b)=>b.count-a.count)
      .slice(0,5);
  }, [filteredData]);

  // Inventors
  const inventorData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      p.inventors?.forEach(i => {
        map[i] = (map[i] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b)=>b.count-a.count)
      .slice(0,5);
  }, [filteredData]);

  // Monthly
  const monthData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      const d = new Date(p.datePublished);
      const key = `${d.getFullYear()}-${d.getMonth()+1}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [filteredData]);

  const COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444"];

  /* ================= DOWNLOAD ================= */

  const downloadChart = () => {
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] space-y-10">

      <h1 className="text-4xl font-bold text-indigo-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.9)] transition hover:drop-shadow-[0_0_50px_rgba(99,102,241,1)]">
         Smart Patent Dashboard
      </h1>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Patents" value={totalPatents}/>
        <Card title="Countries" value={uniqueCountries}/>
        <Card title="Applicants" value={uniqueApplicants}/>
        <Card title="Latest Year" value={latestYear}/>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select value={yearFilter} onChange={e=>setYearFilter(e.target.value)}
          className="input border border-indigo-500/20 hover:border-indigo-500 focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.8)] transition">
          <option value="all">All Years</option>
          {[...new Set(rawData.map(p => new Date(p.datePublished).getFullYear()))]
            .map(y => <option key={y}>{y}</option>)}
        </select>

        <select value={countryFilter} onChange={e=>setCountryFilter(e.target.value)}
          className="input border border-indigo-500/20 hover:border-indigo-500 focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.8)] transition">
          <option value="all">All Countries</option>
          {[...new Set(rawData.map(p => p.jurisdiction))]
            .map(c => <option key={c}>{c}</option>)}
        </select>

        <button onClick={downloadChart}
          className="btn shadow-[0_0_10px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,1)] hover:scale-105 transition">
          ⬇ Download Chart
        </button>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        {["trend","growth","country","status","type","applicant","inventor","month"].map(t => (
          <button
            key={t}
            onClick={()=>setTool(t)}
            className={`btn ${tool===t ? "active":""} shadow-[0_0_10px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,1)] hover:scale-105 transition`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div ref={chartRef} className="card shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.9)] transition hover:scale-[1.01]">

        {tool==="trend" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="year"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="count" stroke="#10b981"/>
            </LineChart>
          </ResponsiveContainer>
        )}

        {tool==="growth" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={growthData}>
              <XAxis dataKey="year"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="growth" fill="#22c55e"/>
            </BarChart>
          </ResponsiveContainer>
        )}

        {tool==="country" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={countryData}>
              <XAxis dataKey="country"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="count" fill="#6366f1"/>
            </BarChart>
          </ResponsiveContainer>
        )}

        {tool==="status" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={statusData} dataKey="value">
                {statusData.map((_,i)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip/><Legend/>
            </PieChart>
          </ResponsiveContainer>
        )}

        {tool==="type" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={typeData} dataKey="value">
                {typeData.map((_,i)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip/><Legend/>
            </PieChart>
          </ResponsiveContainer>
        )}

        {tool==="applicant" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={applicantData}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="count" fill="#f59e0b"/>
            </BarChart>
          </ResponsiveContainer>
        )}

        {tool==="inventor" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={inventorData}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="count" fill="#ef4444"/>
            </BarChart>
          </ResponsiveContainer>
        )}

        {tool==="month" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="count" stroke="#6366f1"/>
            </LineChart>
          </ResponsiveContainer>
        )}

      </div>

      <style jsx>{`
        .card {
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(20px);
          padding:20px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
        }

        .btn {
          padding:10px 18px;
          border-radius:10px;
          background:#1e293b;
          transition:0.3s;
        }

        .btn:hover {
          background:#6366f1;
        }

        .btn.active {
          background:#6366f1;
        }

        .input {
          background:#0f172a;
          padding:10px;
          border-radius:10px;
        }
      `}</style>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card text-center shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,1)] hover:scale-105 transition">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold text-indigo-400">{value}</h2>
    </div>
  );
}