import { useState } from "react";

export default function Logs() {
  const [search, setSearch] = useState("");

  const logsData = [
    { ip: "192.168.1.1", method: "GET", status: 200, time: "2 sec ago" },
    { ip: "10.0.0.5", method: "POST", status: 403, time: "5 sec ago" },
    { ip: "172.16.0.3", method: "GET", status: 500, time: "10 sec ago" },
    { ip: "192.168.1.10", method: "PUT", status: 200, time: "20 sec ago" },
  ];

  const filteredLogs = logsData.filter((log) =>
    log.ip.includes(search)
  );

  const statusColor = (status) => {
    if (status === 200) return "text-green-400";
    if (status === 403) return "text-yellow-400";
    if (status === 500) return "text-red-400";
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl mb-6">📜 Request Logs</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by IP..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-green-400"
      />

      {/* TABLE */}
      <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="pb-3">IP Address</th>
              <th>Method</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800/50 transition"
              >
                <td className="py-3">{log.ip}</td>
                <td>{log.method}</td>

                <td className={statusColor(log.status)}>
                  {log.status}
                </td>

                <td>
  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">
    {log.method}
  </span>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}