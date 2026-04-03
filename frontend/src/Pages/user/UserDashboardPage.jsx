import { useEffect, useState } from "react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";

export default function UserDashboardPage() {

  const [patents,setPatents] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    fetchPatents();
  },[]);

  const fetchPatents = async()=>{
    try{
      const res = await api.get("/api/search",{
        params:{
          q:"artificial intelligence",
          type:"PATENT",
          page:0,
          size:20
        }
      });
      setPatents(res.data.results || []);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  const total = patents.length;
  const active = patents.filter(p=>p.patentStatus==="ACTIVE").length;
  const pending = patents.filter(p=>p.patentStatus==="PENDING").length;
  const discontinued = patents.filter(p=>p.patentStatus==="DISCONTINUED").length;

  if(loading){
    return(
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="loader"></div>
      </div>
    );
  }

  return(

    <div className="min-h-screen px-6 md:px-10 py-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-12">

      {/* HEADER */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-extrabold gradient-text tracking-wide">
          📊 My Patent Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Track your innovation portfolio in real-time
        </p>
      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total" value={total} color="text-indigo-400"/>
        <StatCard title="Active" value={active} color="text-green-400"/>
        <StatCard title="Pending" value={pending} color="text-yellow-400"/>
        <StatCard title="Discontinued" value={discontinued} color="text-red-400"/>
      </div>

      {/* OVERVIEW */}
      <div className="glass-card animate-fade">
        <h3 className="section-title">Portfolio Overview</h3>

        <p className="text-gray-300 leading-relaxed text-lg">
          You currently have
          <span className="highlight"> {total} patents </span>
          in your portfolio. Stay updated with
          <span className="highlight"> status changes </span>,
          global filings, and innovation trends.
        </p>

      </div>

      {/* RECENT */}
      <div className="glass-card animate-fade">
        <h3 className="section-title">Recent Patents</h3>

        <div className="space-y-4 max-h-80 overflow-y-auto custom-scroll">

          {patents.slice(0,5).map(p=>(

            <div key={p.lensId} className="patent-card">

              <p className="title line-clamp-2">{p.title}</p>

              <p className="meta">
                {p.applicants?.[0]} • {p.jurisdiction}
              </p>

              <div className="flex justify-between items-center mt-3">

                <p className="meta-small">
                  {p.datePublished}
                </p>

                <span className={`status ${
                  p.patentStatus === "ACTIVE"
                    ? "active"
                    : p.patentStatus === "PENDING"
                    ? "pending"
                    : "discontinued"
                }`}>
                  {p.patentStatus}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* STYLE */}
      <style jsx>{`

        .gradient-text {
          background: linear-gradient(to right,#6366f1,#9333ea,#ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: rgba(30,41,59,0.65);
          backdrop-filter: blur(30px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
          box-shadow:0 10px 40px rgba(0,0,0,0.4);
          transition:0.3s;
        }

        .glass-card:hover {
          transform:translateY(-3px);
          box-shadow:0 0 60px rgba(99,102,241,0.3);
        }

        .section-title {
          color:#818cf8;
          font-weight:600;
          margin-bottom:15px;
          font-size:18px;
        }

        .highlight {
          color:#c7d2fe;
          font-weight:600;
        }

        .patent-card {
          padding:16px;
          border-radius:14px;
          background:#020617;
          border:1px solid rgba(255,255,255,0.05);
          transition:0.3s;
        }

        .patent-card:hover {
          transform:translateY(-4px);
          box-shadow:0 0 30px rgba(99,102,241,0.35);
        }

        .title {
          color:#e0e7ff;
          font-weight:600;
        }

        .meta {
          font-size:14px;
          color:#9ca3af;
        }

        .meta-small {
          font-size:12px;
          color:#6b7280;
        }

        .status {
          padding:5px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:500;
        }

        .active {
          background:#10b98120;
          color:#10b981;
        }

        .pending {
          background:#f59e0b20;
          color:#f59e0b;
        }

        .discontinued {
          background:#ef444420;
          color:#ef4444;
        }

        .loader {
          width:50px;
          height:50px;
          border:4px solid #6366f1;
          border-top:transparent;
          border-radius:50%;
          animation:spin 1s linear infinite;
        }

        .custom-scroll::-webkit-scrollbar {
          width:6px;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background:#6366f1;
          border-radius:10px;
        }

        .animate-fade {
          animation:fade 0.6s ease-in-out;
        }

        @keyframes fade {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }

        @keyframes spin {
          to { transform:rotate(360deg); }
        }

      `}</style>

    </div>

  );
}