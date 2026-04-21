export default function AlertBox({ message, type }) {
  const styles = {
    danger: "bg-red-500/10 border-red-500 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500 text-yellow-300",
  };

  return (
    <div className={`p-3 rounded-lg border ${styles[type]} mb-2 flex items-center gap-2`}>
      <span className="text-lg">⚠️</span>
      <span>{message}</span>
    </div>
  );
}