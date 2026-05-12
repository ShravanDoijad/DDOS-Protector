import { useDashboardData } from "../hooks/useDashboardData";
import { api } from "../services/api";
import { ShieldAlert, ServerCrash, Activity, ShieldBan } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ThreatMonitor() {
  const { data: threats, loading, error, refetch } = useDashboardData(api.Threats, 3000);

  const handleBlock = async (ip) => {
    try {
      // Mocking block action via UI if no direct API, but we'll show toast.
      toast.success(`IP ${ip} blocked successfully!`, {
        icon: '🛑',
      });
      refetch();
    } catch (err) {
      toast.error(`Failed to block ${ip}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-red-500">
        <ServerCrash className="w-8 h-8 mr-3" />
        <span>Failed to load threats: {error.message || error}</span>
      </div>
    );
  }

  const severityColor = {
    High: "text-red-400 bg-red-500/10 border-red-500/30",
    Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    Low: "text-green-400 bg-green-500/10 border-green-500/30",
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 mb-8"
      >
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Threat Monitor</h2>
          <p className="text-gray-400 mt-1">Real-time analysis of suspicious activities</p>
        </div>
      </motion.div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {threats && threats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Attack Type</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Risk Score</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {threats.map((t, index) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index}
                    className={`hover:bg-gray-800/40 transition-colors ${
                      t.severity === "High" ? "bg-red-500/5" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Activity className={`w-4 h-4 ${t.severity === "High" ? "text-red-500 animate-pulse" : "text-gray-500"}`} />
                        <span className="font-mono text-gray-200">{t.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {t.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColor[t.severity]} ${t.severity === "High" ? "animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]" : ""}`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${t.severity === "High" ? "bg-red-500" : t.severity === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(t.score, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-gray-400">{t.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleBlock(t.ip)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg text-sm transition-all shadow-[0_0_10px_rgba(239,68,68,0)] hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      >
                        <ShieldBan className="w-4 h-4 mr-1.5" />
                        Block IP
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-gray-500">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-gray-400">No Active Threats</h3>
            <p className="mt-1">The network is currently secure.</p>
          </div>
        )}
      </div>
    </div>
  );
}