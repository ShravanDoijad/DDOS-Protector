import { useDashboardData } from "../hooks/useDashboardData";
import { api } from "../api";
import { ShieldBan, ServerCrash, Unlock, Search } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function BlockedIPs() {
  const { data: ips, loading, error, refetch } = useDashboardData(api.getBlockedIps, 5000);

  const handleUnblock = async (ipToRemove) => {
    try {
      await api.unblockIp(ipToRemove);
      toast.success(`IP ${ipToRemove} has been unblocked`, {
        icon: '✅',
      });
      refetch();
    } catch (err) {
      toast.error(`Failed to unblock ${ipToRemove}`);
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
        <span>Failed to load blocked IPs: {error.message || error}</span>
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
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <ShieldBan className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Blocked IPs</h2>
            <p className="text-gray-400 mt-1">Manage currently blacklisted network addresses</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search IP..." 
            className="bg-gray-900/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </motion.div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {ips && ips.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ips.map((ip, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index} 
                  className="hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-gray-200 bg-gray-800 px-3 py-1 rounded-md border border-gray-700">{ip}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border text-red-400 bg-red-500/10 border-red-500/30">
                      Blocked
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleUnblock(ip)}
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 rounded-lg text-sm transition-all"
                    >
                      <Unlock className="w-4 h-4 mr-2 text-green-400" />
                      Unblock
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-gray-500">
            <ShieldBan className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-gray-400">No Blocked IPs</h3>
            <p className="mt-1">All IPs are currently allowed.</p>
          </div>
        )}
      </div>
    </div>
  );
}