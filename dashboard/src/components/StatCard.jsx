import { motion } from 'framer-motion';

const themes = {
  green:  { accent: '#00ffaa', glow: 'rgba(0,255,170,0.15)',  border: 'rgba(0,255,170,0.2)'  },
  red:    { accent: '#ff4466', glow: 'rgba(255,68,102,0.15)', border: 'rgba(255,68,102,0.2)' },
  yellow: { accent: '#ffaa00', glow: 'rgba(255,170,0,0.15)',  border: 'rgba(255,170,0,0.2)'  },
  blue:   { accent: '#00d4ff', glow: 'rgba(0,212,255,0.15)',  border: 'rgba(0,212,255,0.2)'  },
};

export default function StatCard({ title, value, sub, color = 'green', icon: Icon, trend, prefix = '', suffix = '' }) {
  const t = themes[color] || themes.green;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 30px ${t.glow}`,
      }}
    >
      {/* Corner bracket decoration */}
      <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0.3 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M12 0H8V4" stroke={t.accent} strokeWidth="1.5"/>
          <path d="M0 12H4V8" stroke={t.accent} strokeWidth="1.5"/>
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em', fontFamily: 'var(--mono)' }}>
          {title.toUpperCase()}
        </span>
        {Icon && <Icon size={14} color={t.accent} />}
      </div>

      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, color: t.accent, lineHeight: 1, textShadow: `0 0 20px ${t.accent}60` }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}{suffix}
      </div>

      {sub && (
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6, fontFamily: 'var(--mono)' }}>
          {sub}
        </div>
      )}

      {trend !== undefined && (
        <div style={{ fontSize: 10, color: trend >= 0 ? '#ff4466' : '#00ffaa', marginTop: 4 }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last min
        </div>
      )}

      {/* Background glow */}
      <div style={{
        position: 'absolute', bottom: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: t.glow, filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  );
}
