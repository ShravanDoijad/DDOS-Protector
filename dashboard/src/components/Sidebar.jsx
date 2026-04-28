import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShieldBan, Activity, FileText, ShieldAlert } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Threat Monitor", path: "/threats", icon: Activity },
    { name: "Blocked IPs", path: "/blocked", icon: ShieldBan },
    { name: "Logs", path: "/logs", icon: FileText },
  ];

  return (
    <div className="w-64 bg-gray-900/80 backdrop-blur-xl p-6 border-r border-gray-800 flex flex-col h-screen">
      <div className="flex items-center space-x-3 mb-10">
        <ShieldAlert className="text-green-500 w-8 h-8" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent tracking-wide">
          Protector
        </h1>
      </div>

      <ul className="space-y-3 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? "bg-gradient-to-r from-gray-800 to-gray-800/40 text-white shadow-lg border border-gray-700/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:translate-x-1"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-green-400" : ""}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* System Status */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-gray-400 font-medium">System Status</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-green-400">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}