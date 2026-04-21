import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BlockedIPs from "./pages/BlockedIPs";
import ThreatMonitor from "./pages/ThreatMonitor";
import Logs from "./pages/Logs";
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/blocked" element={<BlockedIPs />} />
            <Route path="/threats" element={<ThreatMonitor />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}