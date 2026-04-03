import { LogOut, User, Bell } from "lucide-react";

export default function AdminTopbar({ handleLogout }) {

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
      <div className="flex flex-col">

        <h1 className="
          text-lg font-extrabold tracking-wide
          bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500
          bg-clip-text text-transparent
          animate-gradient
        ">
          Admin Control Panel
        </h1>

        <p className="text-xs text-gray-400">
          Manage system operations
        </p>

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
        <div className="
          flex items-center gap-3
          px-3 py-1 rounded-full
          bg-slate-800/60 backdrop-blur-md
          border border-slate-700/50
          transition-all duration-300
          hover:bg-indigo-500/10
          hover:scale-105
        ">

          <div className="
            w-8 h-8 rounded-full
            flex items-center justify-center
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            text-white font-semibold
            shadow-md
          ">
            A
          </div>

          <span className="text-sm text-gray-300">
            Admin
          </span>

        </div>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2 px-4 py-2
            rounded-xl text-sm font-medium
            bg-red-500/90
            transition-all duration-300
            hover:scale-110
            hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]
          "
        >
          <LogOut size={16} />
          Logout
        </button>

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