import { motion } from "framer-motion";

const colorStyles = {
  red: "text-red-400 border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  green: "text-green-400 border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent shadow-[0_0_15px_rgba(34,197,94,0.1)]",
  yellow: "text-yellow-400 border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent shadow-[0_0_15px_rgba(234,179,8,0.1)]",
  blue: "text-blue-400 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.1)]",
};

export default function StatCard({ title, value, color = "blue", icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, translateY: -5 }}
      className={`relative overflow-hidden backdrop-blur-xl p-6 rounded-2xl border transition-all duration-300 ${colorStyles[color]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-bold text-white">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 ${colorStyles[color].split(" ")[0]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Decorative background glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current`} />
    </motion.div>
  );
}
