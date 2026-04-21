
import { motion } from "framer-motion";

const colors = {
  red: "text-red-400 border-red-500/30",
  green: "text-green-400 border-green-500/30",
  yellow: "text-yellow-400 border-yellow-500/30",
  blue: "text-blue-400 border-blue-500/30",
};

export default function StatCard({ title, value, color = "blue" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className={`bg-gray-800/60 backdrop-blur-md p-5 rounded-2xl border shadow-lg 
      ${colors[color]} hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition duration-300`}
    >
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </motion.div>
  );
}

