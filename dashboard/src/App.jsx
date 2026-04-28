import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BlockedIPs from "./pages/BlockedIPs";
import ThreatMonitor from "./pages/ThreatMonitor";
import Logs from "./pages/Logs";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden">
        <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
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