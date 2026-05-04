import { useState, useEffect } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar({ title, subtitle, alerts = [], onRefresh, lastUpdated }) {
  const [tick, setTick] = useState(0);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const ago = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
    : null;

  return (
    <div style={{
      padding: '18px 28px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(13,17,23,0.8)',
      backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', letterSpacing: '0.02em' }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{subtitle}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Last updated */}
        {ago !== null && (
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
            updated {ago}s ago
          </span>
        )}

        {/* Refresh */}
        {onRefresh && (
          <button onClick={onRefresh} style={{
            background: 'none', border: '1px solid var(--border2)',
            borderRadius: 6, padding: '5px 8px', cursor: 'pointer',
            color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
          >
            <RefreshCw size={12} />
          </button>
        )}

        {/* Alerts bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowAlerts(p => !p)} style={{
            background: alerts.length > 0 ? 'rgba(255,68,102,0.08)' : 'none',
            border: `1px solid ${alerts.length > 0 ? 'rgba(255,68,102,0.3)' : 'var(--border)'}`,
            borderRadius: 6, padding: '5px 8px', cursor: 'pointer',
            color: alerts.length > 0 ? '#ff4466' : 'var(--text3)',
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
          }}>
            <Bell size={12} />
            {alerts.length > 0 && <span>{alerts.length}</span>}
          </button>
          <AnimatePresence>
            {showAlerts && alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 6,
                  background: 'var(--bg2)', border: '1px solid var(--border2)',
                  borderRadius: 8, padding: 8, width: 280, zIndex: 100,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {alerts.map((a, i) => (
                  <div key={i} style={{
                    padding: '7px 10px', borderRadius: 5,
                    background: 'rgba(255,68,102,0.06)',
                    border: '1px solid rgba(255,68,102,0.15)',
                    marginBottom: i < alerts.length - 1 ? 5 : 0,
                    fontSize: 11, color: 'var(--text2)',
                  }}>
                    <span style={{ color: '#ff4466' }}>⚠ </span>{a}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(0,255,170,0.2)', background: 'rgba(0,255,170,0.05)' }}>
          <div style={{ position: 'relative', width: 6, height: 6 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00ffaa', opacity: 0.5, animation: 'pulse-ring 1.5s ease-out infinite' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ffaa' }} />
          </div>
          <span style={{ fontSize: 10, color: '#00ffaa', letterSpacing: '0.1em' }}>LIVE</span>
        </div>
      </div>
    </div>
  );
}
