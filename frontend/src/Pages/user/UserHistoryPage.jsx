import { useEffect, useState } from "react";

export default function UserHistoryPage(){

  const [history,setHistory] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    fetchHistory();
  },[]);

  const fetchHistory = async()=>{
    try{
      const data = [
        {
          id:1,
          action:"Viewed Patent",
          title:"AI Edge Node and Edge AI System",
          date:"2026-03-01"
        },
        {
          id:2,
          action:"Saved Patent",
          title:"AI Caregiver Matching Device",
          date:"2026-02-20"
        },
        {
          id:3,
          action:"Exported Patent Data",
          title:"AI Implemented AI Termination",
          date:"2026-02-10"
        }
      ];
      setHistory(data);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return(
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="loader"></div>
      </div>
    );
  }

  return(

    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold gradient-text">
          🕒 Activity History
        </h1>
        <p className="text-gray-400 mt-2">
          Track all your recent actions
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative border-l border-gray-700 ml-4 space-y-8">

        {history.map(item=>(

          <div key={item.id} className="ml-6">

            {/* DOT */}
            <span className="dot"></span>

            {/* CARD */}
            <div className="card">

              <div className="flex justify-between items-center mb-2">

                <p className="action">{item.action}</p>

                <span className="date">{item.date}</span>

              </div>

              <p className="title">{item.title}</p>

            </div>

          </div>

        ))}

      </div>

      {/* STYLE */}
      <style jsx>{`

        .gradient-text {
          background: linear-gradient(to right,#6366f1,#9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(20px);
          padding:18px;
          border-radius:15px;
          border:1px solid rgba(255,255,255,0.08);
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-3px);
          box-shadow:0 0 25px rgba(99,102,241,0.3);
        }

        .dot {
          position:absolute;
          left:-10px;
          width:12px;
          height:12px;
          background:#6366f1;
          border-radius:50%;
        }

        .action {
          color:#818cf8;
          font-weight:600;
        }

        .title {
          color:#cbd5f5;
          font-size:14px;
        }

        .date {
          font-size:12px;
          color:#9ca3af;
        }

        .loader {
          width:50px;
          height:50px;
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