import { useState } from "react";

export default function ThreatMonitor() {
  const [threats] = useState([
    {
      ip: "192.168.1.1",
      type: "DDoS Attack",
      severity: "High",
      time: "2 sec ago",
    },
    {
      ip: "10.0.0.5",
      type: "Brute Force",
      severity: "Medium",
      time: "10 sec ago",
    },
    {
      ip: "172.16.0.3",
      type: "Suspicious Activity",
      severity: "Low",
      time: "30 sec ago",
    },
  ]);

  const severityColor = {
    High: "text-red-400",
    Medium: "text-yellow-400",
    Low: "text-green-400",
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl mb-6">🚨 Threat Monitor</h2>

      <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="pb-3">IP Address</th>
              <th>Attack Type</th>
              <th>Severity</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
  {threats.map((t, index) => (
    <tr
      key={index}
      className={`border-b border-gray-700 hover:bg-gray-800/50 transition
      ${t.severity === "High" ? "bg-red-500/5" : ""}`}
    >
      <td className="py-3">{t.ip}</td>
      <td>{t.type}</td>

      <td
        className={`${severityColor[t.severity]} ${
          t.severity === "High" ? "animate-pulse" : ""
        }`}
      >
        {t.severity}
      </td>

      <td>{t.time}</td>

      {/* ACTION BUTTON */}
      <td>
        <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
          Block
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