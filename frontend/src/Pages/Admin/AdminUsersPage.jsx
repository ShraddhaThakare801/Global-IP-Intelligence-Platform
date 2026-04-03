import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminUsersPage() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          👥 User Management
        </h1>
        <p className="text-gray-400 mt-2">
          Manage all platform users
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="glass-card overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">Username</th>
              <th className="p-4">Roles</th>
            </tr>
          </thead>

          <tbody>

            {users.map(u => (

              <tr
                key={u.id}
                className="row"
              >

                <td className="p-4 font-semibold text-indigo-300">
                  {u.username}
                </td>

                <td className="p-4">

                  {u.roles?.map((role, i) => (
                    <span key={i} className="role-badge">
                      {role}
                    </span>
                  ))}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

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
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.08);
        }

        .row {
          border-bottom:1px solid rgba(255,255,255,0.05);
          transition:0.3s;
        }

        .row:hover {
          background:rgba(99,102,241,0.1);
        }

        .role-badge {
          display:inline-block;
          background:#6366f1;
          padding:5px 12px;
          border-radius:999px;
          font-size:12px;
          margin-right:6px;
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