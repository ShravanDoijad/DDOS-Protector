import { useDashboardData } from "../hooks/useDashboardData";
import { api } from "../api";
import StatCard from "../components/StatCard";
import TrafficChart from "../charts/TrafficChart";
import AlertBox from "../components/AlertBox";
import { Activity, ShieldBan, AlertTriangle, Zap, ServerCrash } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, loading, error } = useDashboardData(api.getSummary, 5000);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-red-500">
        <ServerCrash className="w-8 h-8 mr-3" />
        <span>Failed to load dashboard data: {error.message || error}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
          <p className="text-gray-400 mt-1">Real-time DDoS protection monitoring via Axios API Gateway</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700/50 flex items-center">
          <span className="text-sm text-gray-300">Live Traffic</span>
          <span className="ml-3 flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Requests" value={data?.requests || 0} color="blue" icon={Activity} />
        <StatCard title="Blocked IPs" value={data?.blocked || 0} color="red" icon={ShieldBan} />
        <StatCard title="Active Threats" value={data?.threats || 0} color="yellow" icon={AlertTriangle} />
        <StatCard title="Requests / Sec" value={data?.rps || 0} color="green" icon={Zap} />
      </div>

      {/* Alerts - show only if there are active threats */}
      {data?.threats > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 space-y-3"
        >
          <AlertBox
            message={`${data.threats} active threats detected in the network.`}
            type="warning"
          />
        </motion.div>
      )}

      {/* Chart + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Traffic Analysis</h3>
          </div>
          <div className="h-[300px]">
            <TrafficChart data={data?.recentTraffic} />
          </div>
        </div>

        {/* Side Panel */}
        <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800 shadow-2xl flex flex-col">
          <h3 className="mb-6 text-xl font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            Top Attacking IPs
          </h3>

          <ul className="space-y-4 flex-1 overflow-y-auto pr-2">
            {data?.topIps && data.topIps.length > 0 ? (
              data.topIps.map((target, idx) => (
                <motion.li 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="flex justify-between items-center bg-gray-800/40 p-3 rounded-lg border border-gray-700/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-mono text-sm text-gray-200">{target.ip}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Reqs:</span>
                    <span className="text-sm font-bold text-red-400">{target.count}</span>
                  </div>
                </motion.li>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                <ShieldBan className="w-12 h-12 opacity-20" />
                <p>No attacks detected</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}