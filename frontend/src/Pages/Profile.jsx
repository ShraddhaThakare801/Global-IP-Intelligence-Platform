import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { User, Mail, Shield, Building, Phone } from "lucide-react";

const Profile = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      let endpoint = "";

      if (role === "ADMIN") endpoint = "/api/admin/me";
      else if (role === "ANALYST") endpoint = "/api/analyst/me";
      else endpoint = "/api/user/me";

      const res = await api.get(endpoint);
      setUser(res.data);

    } catch (error) {

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("Failed to load profile.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully 👋");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-400">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-10 text-gray-400">No profile data found.</div>;
  }

  return (

    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          👤 My Profile
        </h1>
      </div>

      {/* PROFILE CARD */}
      <div className="glass-card max-w-5xl mx-auto">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">

          {/* AVATAR */}
          <div className="avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          {/* USER INFO */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>

            <span className="role-badge">
              {role}
            </span>
          </div>

        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          <Info icon={<User size={18}/>} label="Username" value={user.username}/>
          <Info icon={<Mail size={18}/>} label="Email" value={user.email}/>
          <Info icon={<Shield size={18}/>} label="Role" value={role}/>

          {user.organization && (
            <Info icon={<Building size={18}/>} label="Organization" value={user.organization}/>
          )}

          {user.phone && (
            <Info icon={<Phone size={18}/>} label="Phone" value={user.phone}/>
          )}

        </div>

        {/* ACTION */}
        <div className="mt-10 flex justify-center">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

      </div>

      {/* STYLE */}
      <style jsx>{`

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:30px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
          box-shadow: 0 0 40px rgba(99,102,241,0.2);
        }

        .avatar {
          width:80px;
          height:80px;
          border-radius:50%;
          background: linear-gradient(to right,#6366f1,#9333ea);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:30px;
          font-weight:bold;
          box-shadow:0 0 20px rgba(99,102,241,0.6);
        }

        .role-badge {
          display:inline-block;
          margin-top:8px;
          padding:5px 12px;
          border-radius:999px;
          background:linear-gradient(to right,#6366f1,#9333ea);
          font-size:12px;
        }

        .logout-btn {
          padding:12px 25px;
          border-radius:12px;
          background:#ef4444;
          transition:0.3s;
        }

        .logout-btn:hover {
          transform:scale(1.05);
          box-shadow:0 0 20px #ef4444;
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
};

/* INFO COMPONENT */

const Info = ({ icon, label, value }) => (

  <div className="info-card">

    <div className="icon">{icon}</div>

    <div>
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>

    <style jsx>{`
      .info-card {
        display:flex;
        gap:12px;
        padding:15px;
        border-radius:12px;
        background:#020617;
        border:1px solid rgba(255,255,255,0.05);
        transition:0.3s;
      }

      .info-card:hover {
        transform:scale(1.03);
        box-shadow:0 0 20px rgba(99,102,241,0.4);
      }

      .icon {
        color:#818cf8;
        margin-top:2px;
      }

      .label {
        font-size:12px;
        color:#9ca3af;
      }

      .value {
        font-weight:500;
      }
    `}</style>

  </div>
);

export default Profile;