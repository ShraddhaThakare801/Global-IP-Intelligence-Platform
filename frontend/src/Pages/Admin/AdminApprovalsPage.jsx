import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminApprovalsPage() {

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/api/admin/analysts/pending");
      setPending(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await api.post(`/api/admin/analysts/${id}/approve`);
    fetchPending();
  };

  const reject = async (id) => {
    await api.post(`/api/admin/analysts/${id}/reject`);
    fetchPending();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="loader"></div>
      </div>
    );
  }

  return (

    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold gradient-text">
          📨 Analyst Approval Requests
        </h1>
        <p className="text-gray-400 mt-2">
          Review and manage analyst access
        </p>
      </div>

      {/* EMPTY STATE */}
      {pending.length === 0 && (
        <div className="glass-card text-center py-16">
          <p className="text-gray-400 text-lg">No pending requests</p>
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">

        {pending.map(a => (

          <div key={a.id} className="card">

            {/* USER INFO */}
            <div className="mb-4">
              <p className="username">{a.username}</p>
              <p className="email">{a.email}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">

              <button
                onClick={() => approve(a.id)}
                className="btn btn-green"
              >
                ✔ Approve
              </button>

              <button
                onClick={() => reject(a.id)}
                className="btn btn-red"
              >
                ✖ Reject
              </button>

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

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
        }

        .card {
          background:#020617;
          padding:20px;
          border-radius:15px;
          border:1px solid rgba(255,255,255,0.05);
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-5px);
          box-shadow:0 0 30px rgba(99,102,241,0.4);
        }

        .username {
          color:#c7d2fe;
          font-weight:600;
          font-size:16px;
        }

        .email {
          color:#9ca3af;
          font-size:13px;
        }

        .btn {
          flex:1;
          padding:10px;
          border-radius:10px;
          transition:0.3s;
          font-weight:600;
        }

        .btn-green {
          background:#16a34a;
        }

        .btn-green:hover {
          box-shadow:0 0 15px #16a34a;
        }

        .btn-red {
          background:#dc2626;
        }

        .btn-red:hover {
          box-shadow:0 0 15px #dc2626;
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