import { useState } from "react";

export default function BlockedIPs() {
  const [ips, setIps] = useState([
    { ip: "192.168.1.1", reason: "DDoS Attack" },
    { ip: "10.0.0.5", reason: "Brute Force" },
    { ip: "172.16.0.3", reason: "Suspicious Activity" },
  ]);

  const handleUnblock = (ipToRemove) => {
    setIps(ips.filter((item) => item.ip !== ipToRemove));
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl mb-6">🚫 Blocked IPs</h2>

      <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="pb-3">IP Address</th>
              <th className="pb-3">Reason</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {ips.map((item, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-3">{item.ip}</td>
                <td>{item.reason}</td>
                <td>
                  <button
                    onClick={() => handleUnblock(item.ip)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  >
                    Unblock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}