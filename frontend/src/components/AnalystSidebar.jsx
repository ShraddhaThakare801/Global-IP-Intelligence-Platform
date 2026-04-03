import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  FileDown,
  User
} from "lucide-react";

export default function AnalystSidebar() {

  const linkStyle = ({ isActive }) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
    ${
      isActive
        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 shadow-lg shadow-indigo-500/20"
        : "text-gray-400 hover:text-indigo-400 hover:bg-slate-800 hover:translate-x-1"
    }`;

  return (
    <aside
      className="
      fixed
      top-16
      left-0
      w-64
      h-[calc(100vh-4rem)]
      bg-gradient-to-b from-slate-950 to-black
      border-r border-slate-800
      p-6
      shadow-2xl
      overflow-y-auto
      "
    >

      {/* TITLE */}
      <div className="mb-10">

        <h2
          className="
          text-2xl font-extrabold
          bg-gradient-to-r from-indigo-400 to-purple-500
          bg-clip-text text-transparent
          tracking-wide
          relative inline-block
          "
        >
          Analyst Panel
        </h2>

        {/* underline */}
        <div className="w-12 h-[3px] bg-indigo-500 rounded-full mt-2"></div>

      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2">

        <NavLink to="/analyst/dashboard" className={linkStyle}>
          {({ isActive }) => (
            <>
              {isActive && <span className="active-line"></span>}
              <LayoutDashboard size={18}/> Dashboard
            </>
          )}
        </NavLink>

        <NavLink to="/analyst/search" className={linkStyle}>
          {({ isActive }) => (
            <>
              {isActive && <span className="active-line"></span>}
              <Search size={18}/> Search
            </>
          )}
        </NavLink>

        <NavLink to="/analyst/visualization" className={linkStyle}>
          {({ isActive }) => (
            <>
              {isActive && <span className="active-line"></span>}
              <BarChart3 size={18}/> Visualization
            </>
          )}
        </NavLink>

        <NavLink to="/analyst/export" className={linkStyle}>
          {({ isActive }) => (
            <>
              {isActive && <span className="active-line"></span>}
              <FileDown size={18}/> Export
            </>
          )}
        </NavLink>

        <NavLink to="/analyst/profile" className={linkStyle}>
          {({ isActive }) => (
            <>
              {isActive && <span className="active-line"></span>}
              <User size={18}/> Profile
            </>
          )}
        </NavLink>

      </nav>

      {/* STYLE */}
      <style jsx>{`
        .active-line {
          position:absolute;
          left:-6px;
          top:8px;
          bottom:8px;
          width:4px;
          background:#6366f1;
          border-radius:4px;
        }
      `}</style>

    </aside>
  );
}