import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Blocked IPs", path: "/blocked" },
    { name: "Threat Monitor", path: "/threats" },
    { name: "Logs", path: "/logs" },
  ];

  return (
    <div className="w-64 bg-gray-900/70 backdrop-blur-lg p-6 border-r border-gray-800">
      <h1 className="text-2xl font-bold mb-10 text-green-400 tracking-wide">
        DDoS Shield
      </h1>

      <ul className="space-y-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-lg transition duration-200 
                  ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}