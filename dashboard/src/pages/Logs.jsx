import { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { api } from "../api";
import { FileText, ServerCrash, Search, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Logs() {
  const { data: logData, loading, error } = useDashboardData(api.getLogs, 3000);
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-red-500">
        <ServerCrash className="w-8 h-8 mr-3" />
        <span>Failed to load logs: {error.message || error}</span>
      </div>
    );
  }

  const logs = logData || [];
  const filteredLogs = logs.filter((log) =>
    (log.ip || "").toLowerCase().includes(search.toLowerCase()) || 
    (log.url || "").toLowerCase().includes(search.toLowerCase())
  );

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'POST': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'PUT': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'DELETE': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Request Logs</h2>
            <p className="text-gray-400 mt-1">Live stream of incoming network traffic via Axios</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IP or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors w-64"
          />
        </div>
      </motion.div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">Requested URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 > 0.5 ? 0 : index * 0.02 }}
                    key={index}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 opacity-50" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-gray-200">{log.ip?.replace('::ffff:', '') || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getMethodColor(log.method)}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate" title={log.url}>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-500" />
                        {log.url}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-gray-500">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-gray-400">No logs found</h3>
            <p className="mt-1">Adjust your search or wait for incoming traffic.</p>
          </div>
        )}
      </div>
    </div>
  );
}