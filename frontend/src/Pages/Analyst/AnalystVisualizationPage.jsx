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

  const trendData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      const year = new Date(p.datePublished).getFullYear();
      map[year] = (map[year] || 0) + 1;
    });
    return Object.entries(map).map(([year, count]) => ({ year, count }));
  }, [filteredData]);

  const growthData = trendData.map((d,i,arr)=>({
    year: d.year,
    growth: i===0 ? 0 : d.count - arr[i-1].count
  }));

  const countryData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      map[p.jurisdiction] = (map[p.jurisdiction] || 0) + 1;
    });
    return Object.entries(map).map(([country, count]) => ({ country, count }));
  }, [filteredData]);

  const statusData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      map[p.patentStatus] = (map[p.patentStatus] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const typeData = useMemo(() => {
    const map = {};
    filteredData.forEach(p => {
      map[p.publicationType] = (map[p.publicationType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

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

  const downloadChart = () => {
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Smart Patent Dashboard Visualization
      </h1>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Patents" value={totalPatents}/>
        <Card title="Countries" value={uniqueCountries}/>
        <Card title="Applicants" value={uniqueApplicants}/>
        <Card title="Latest Year" value={latestYear}/>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 flex-wrap justify-center">
        <select value={yearFilter} onChange={e=>setYearFilter(e.target.value)} className="input">
          <option value="all">All Years</option>
          {[...new Set(rawData.map(p => new Date(p.datePublished).getFullYear()))]
            .map(y => <option key={y}>{y}</option>)}
        </select>

        <select value={countryFilter} onChange={e=>setCountryFilter(e.target.value)} className="input">
          <option value="all">All Countries</option>
          {[...new Set(rawData.map(p => p.jurisdiction))]
            .map(c => <option key={c}>{c}</option>)}
        </select>

        <button onClick={downloadChart} className="btn glow">
          ⬇ Download Chart
        </button>
      </div>

      {/* TOOL BUTTONS */}
      <div className="flex flex-wrap gap-3 justify-center">
        {["trend","growth","country","status","type","applicant","inventor","month"].map(t => (
          <button
            key={t}
            onClick={()=>setTool(t)}
            className={`btn ${tool===t ? "active glow" : ""}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div ref={chartRef} className="card hover-glow">

        {/* SAME CHARTS (UNCHANGED LOGIC) */}
        {tool==="trend" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="year"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="count" stroke="#22c55e" strokeWidth={3}/>
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
                {statusData.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
              </Pie>
              <Tooltip/><Legend/>
            </PieChart>
          </ResponsiveContainer>
        )}

        {tool==="type" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={typeData} dataKey="value">
                {typeData.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
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
              <Line dataKey="count" stroke="#6366f1" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        )}

      </div>

      {/* STYLE */}
      <style jsx>{`
        .card {
          background: rgba(15,23,42,0.7);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
          transition:0.3s;
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(99,102,241,0.5);
        }

        .btn {
          padding:10px 20px;
          border-radius:12px;
          background:#1e293b;
          transition:0.3s;
          font-weight:600;
        }

        .btn:hover {
          transform: scale(1.05);
          background:#6366f1;
        }

        .btn.active {
          background:#6366f1;
        }

        .glow {
          box-shadow: 0 0 15px rgba(99,102,241,0.7);
        }

        .input {
          background:#0f172a;
          padding:10px 15px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.1);
        }
      `}</style>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card hover-glow text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-indigo-400">{value}</h2>
    </div>
  );
}