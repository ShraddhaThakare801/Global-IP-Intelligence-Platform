import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Activity,
  FileText
} from "lucide-react";

export default function AdminSidebar() {

  const linkStyle = ({ isActive }) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
    ${
      isActive
        ? "bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 text-violet-400 shadow-lg shadow-violet-500/20"
        : "text-gray-400 hover:text-violet-400 hover:bg-slate-800 hover:translate-x-1"
    }`;

  const renderLink = (to, icon, label) => (
    <NavLink to={to} className={linkStyle}>
      {({ isActive }) => (
        <>
          {isActive && <span className="active-line"></span>}
          {icon}
          {label}
        </>
      )}
    </NavLink>
  );

  return (
    <aside
      className="
      fixed
      top-16
      left-0
      w-64
      h-[calc(100vh-4rem)]
      bg-gradient-to-b from-black via-slate-950 to-black
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
          bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500
          bg-clip-text text-transparent
          tracking-wide
          relative inline-block
          "
        >
          Admin Panel
        </h2>

        {/* underline */}
        <div className="w-12 h-[3px] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-2"></div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2">

        {renderLink("/admin/dashboard", <LayoutDashboard size={18}/>, "Dashboard")}
        {renderLink("/admin/approvals", <UserCheck size={18}/>, "Approvals")}
        {renderLink("/admin/users", <Users size={18}/>, "Users")}
        {renderLink("/admin/api-health", <Activity size={18}/>, "API Health")}
        {renderLink("/admin/logs", <FileText size={18}/>, "Logs")}
        
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-10 text-center text-xs text-gray-500">
        ⚙ Admin System
      </div>

      {/* STYLE */}
      <style jsx>{`
        .active-line {
          position:absolute;
          left:-6px;
          top:8px;
          bottom:8px;
          width:4px;
          background: linear-gradient(to bottom,#7C3AED,#A78BFA);
          border-radius:4px;
          box-shadow:0 0 10px #7C3AED;
        }
      `}</style>

    </aside>
  );
}