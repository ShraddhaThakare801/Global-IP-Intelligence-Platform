import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  History,
  User,
  Bell,
} from "lucide-react";

export default function UserSidebar() {
  const links = [
    { path: "/user/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/user/search", label: "Patent Search", icon: Search },
    { path: "/user/watchlist", label: "Watchlist", icon: Bookmark },
    { path: "/user/history", label: "History", icon: History },
    { path: "/user/status-dashboard", label: "Status Dashboard", icon: Bell },
    { path: "/user/profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="
      w-64
      bg-gradient-to-b from-[#020617] via-[#020617] to-black
      border-r border-slate-800
      p-6
      shadow-2xl
    ">

      {/* TITLE */}
      <h2 className="
        text-xl font-bold mb-8
        bg-gradient-to-r from-indigo-400 to-purple-500
        bg-clip-text text-transparent
      ">
        User Panel
      </h2>

      {/* MENU */}
      <nav className="space-y-2">

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 shadow-md shadow-indigo-500/20"
                    : "text-gray-400 hover:text-indigo-300 hover:bg-slate-800/70 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="active-line"></span>}
                  <Icon size={18} />
                  {link.label}
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* STYLE */}
      <style jsx>{`
        .active-line {
          position: absolute;
          left: -6px;
          top: 8px;
          bottom: 8px;
          width: 4px;
          background: linear-gradient(to bottom, #6366f1, #a855f7);
          border-radius: 4px;
        }
      `}</style>

    </aside>
  );
}