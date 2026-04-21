import StatCard from "../components/StatCard";
import TrafficChart from "../charts/TrafficChart";
import AlertBox from "../components/AlertBox";

export default function Dashboard() {
  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-semibold mb-8">
        🚀 Dashboard Overview
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Requests" value="1200" color="blue" />
        <StatCard title="Blocked" value="300" color="red" />
        <StatCard title="Threats" value="12" color="yellow" />
        <StatCard title="RPS" value="85" color="green" />
      </div>

      {/* Alerts */}
      <div className="mb-6">
        <AlertBox
          message="High traffic spike detected from 192.168.1.1"
          type="danger"
        />
        <AlertBox
          message="Possible brute force attack detected"
          type="warning"
        />
      </div>

      {/* Chart + Side Panel */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2">
          <TrafficChart />
        </div>

        {/* Side Panel */}
        <div className="bg-gray-800/60 backdrop-blur-md p-5 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-300">
            🌍 Top Attacking IPs
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="flex justify-between">
              <span>192.168.1.1</span>
              <span className="text-red-400">High</span>
            </li>
            <li className="flex justify-between">
              <span>10.0.0.5</span>
              <span className="text-yellow-400">Medium</span>
            </li>
            <li className="flex justify-between">
              <span>172.16.0.3</span>
              <span className="text-green-400">Low</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}