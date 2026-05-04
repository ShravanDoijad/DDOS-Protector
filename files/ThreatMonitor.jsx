import { useLiveData } from '../hooks/useLiveData';
import { api } from '../services/api';
import TopBar from '../components/TopBar';
import { Activity, ShieldBan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const severity = (score) => {
  if (score >= 60) return { label: 'CRITICAL', color: '#ff4466', bg: 'rgba(255,68,102,0.08)' };
  if (score >= 40) return { label: 'HIGH', color: '#ff4466', bg: 'rgba(255,68,102,0.05)' };
  if (score >= 20) return { label: 'MEDIUM', color: '#ffaa00', bg: 'rgba(255,170,0,0.05)' };
  return { label: 'LOW', color: '#00ffaa', bg: 'transparent' };
};

export default function ThreatMonitor() {
  const { data: threats, loading, error, refetch, lastUpdated } = useLiveData(api.getThreats, 3000);

  const handleBlock = async (ip) => {
    try {
      await api.blockIp(ip, 3600);
      toast.success(`${ip} blocked for 1 hour`, { style: { background: '#0d1117', color: '#00ffaa', border: '1px solid rgba(0,255,170,0.3)', fontFamily: 'var(--mono)', fontSize: 12 } });
      refetch();
    } catch {
      toast.error(`Failed to block ${ip}`);
    }
  };

  const list = threats || [];
  const sorted = [...list].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Threat Monitor" subtitle={`${list.length} IPs with active threat scores`} onRefresh={refetch} lastUpdated={lastUpdated} />

      <div style={{ padding: '24px 28px' }}>
        {/* Summary bar */}
        {list.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => {
              const thresholds = { CRITICAL: 60, HIGH: 40, MEDIUM: 20, LOW: 0 };
              const maxes = { CRITICAL: Infinity, HIGH: 60, MEDIUM: 40, LOW: 20 };
              const count = list.filter(t => (t.score || 0) >= thresholds[sev] && (sev === 'CRITICAL' || (t.score || 0) < maxes[sev])).length;
              const sevData = severity(thresholds[sev]);
              return (
                <div key={sev} style={{ background: 'var(--surface)', border: `1px solid ${sevData.color}30`, borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 4 }}>{sev}</div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 28, color: sevData.color }}>{count}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: 11 }}>Loading threats...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#ff4466', fontSize: 11 }}>{error}</div>
          ) : sorted.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.2 }}>🛡</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>Network secure</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>No active threat scores</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['IP ADDRESS', 'SEVERITY', 'SCORE', 'ATTACK TYPE', 'COUNTRY', 'ACTION'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', fontSize: 9, color: 'var(--text3)', textAlign: 'left', letterSpacing: '0.12em', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((t, i) => {
                    const sev = severity(t.score || 0);
                    return (
                      <motion.tr key={t.ip || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{ borderBottom: '1px solid var(--border)', background: sev.bg, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = sev.bg}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {(t.score || 0) >= 40 && <Activity size={12} color="#ff4466" style={{ animation: 'blink 1.2s step-end infinite' }} />}
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)' }}>{t.ip}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                            color: sev.color, background: `${sev.color}15`,
                            border: `1px solid ${sev.color}30`,
                            padding: '3px 8px', borderRadius: 4,
                          }}>{sev.label}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 60, height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(t.score || 0, 100)}%`, height: '100%', background: sev.color, borderRadius: 2 }} />
                            </div>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: sev.color }}>{t.score || 0}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                          {t.attackType || t.type || '—'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text3)' }}>
                          {t.country || '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => handleBlock(t.ip)} style={{
                            padding: '5px 12px', fontSize: 10, letterSpacing: '0.05em',
                            background: 'rgba(255,68,102,0.08)', color: '#ff4466',
                            border: '1px solid rgba(255,68,102,0.25)', borderRadius: 5,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'all 0.15s', fontFamily: 'var(--mono)',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#ff4466'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,68,102,0.08)'; e.currentTarget.style.color = '#ff4466'; }}
                          >
                            <ShieldBan size={10} /> BLOCK
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
