import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnalystTopbar() {

  const navigate = useNavigate();

  return (

    <div className="
      fixed top-0 left-0 right-0 h-16 px-8
      flex items-center justify-between
      bg-slate-900/70 backdrop-blur-xl
      border-b border-slate-700/50
      shadow-[0_8px_30px_rgba(0,0,0,0.7)]
      z-50
    ">

      {/* LEFT */}
      <div className="flex items-center gap-6">

        <h1 className="
          text-lg font-extrabold tracking-wide
          bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500
          bg-clip-text text-transparent
          animate-gradient
        ">
          Global IP Intelligence Platform
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* 🔔 NOTIFICATION */}
        <div className="relative group">

          <div className="
            p-2 rounded-xl
            bg-slate-800/60 backdrop-blur-md
            border border-slate-700/50
            cursor-pointer transition-all duration-300
            group-hover:bg-indigo-500/20
            group-hover:scale-110
            group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]
          ">

            {/* Pulse dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>

            <Bell size={18} className="text-gray-300" />

          </div>

        </div>

        {/* 👤 PROFILE */}
        <div
          onClick={() => navigate("/analyst/profile")}
          className="
          relative flex items-center justify-center
          w-10 h-10 rounded-full
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          text-white font-semibold
          shadow-lg cursor-pointer
          transition-all duration-300
          hover:scale-110
          hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]
        ">

          {/* Glow ring */}
          <span className="
            absolute inset-0 rounded-full
            border-2 border-transparent
            group-hover:border-indigo-400
          "></span>

          <User size={16}/>

        </div>

      </div>

      {/* STYLE */}
      <style jsx>{`

        .animate-gradient {
          background-size: 300%;
          animation: gradientMove 6s linear infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% }
          100% { background-position: 100% }
        }

      `}</style>

    </div>

  );
}