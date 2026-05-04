import { useState, useMemo } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { api } from '../services/api';
import TopBar from '../components/TopBar';
import { Search, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const METHOD_COLORS = {
  GET: '#00ffaa', POST: '#00d4ff', PUT: '#ffaa00',
  DELETE: '#ff4466', PATCH: '#b48eff', OPTIONS: 'var(--text3)',
};

const toastStyle = { style: { background: '#0d1117', color: '#00ffaa', border: '1px solid rgba(0,255,170,0.3)', fontFamily: 'var(--mono)', fontSize: 12 } };

export default function Logs() {
  const { data: logData, loading, error, refetch, lastUpdated } = useLiveData(api.getLogs, 3000);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const logs = Array.isArray(logData) ? logData : [];
  const methods = ['ALL', ...Array.from(new Set(logs.map(l => l.method).filter(Boolean)))];

  const filtered = useMemo(() => logs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || (l.ip || '').toLowerCase().includes(q) || (l.url || '').toLowerCase().includes(q);
    const matchMethod = methodFilter === 'ALL' || l.method === methodFilter;
    return matchSearch && matchMethod;
  }), [logs, search, methodFilter]);

  const handleClear = async () => {
    try {
      await api.clearLogs();
      toast.success('Logs cleared', toastStyle);
      refetch();
    } catch { toast.error('Failed to clear logs'); }
  };

  const fmtTime = (ts) => {
    try { return new Date(ts).toLocaleTimeString('en', { hour12: false }); }
    catch { return '?'; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Request Logs" subtitle={`${filtered.length} entries`} onRefresh={refetch} lastUpdated={lastUpdated} />

      <div style={{ padding: '24px 28px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by IP or URL..."
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 6, color: 'var(--text)', fontSize: 12, fontFamily: 'var(--mono)', padding: '7px 12px 7px 32px', outline: 'none', width: '100%' }} />
          </div>

          {/* Method filter pills */}
          <div style={{ display: 'flex', gap: 5 }}>
            {methods.map(m => {
              const c = METHOD_COLORS[m] || 'var(--text2)';
              const active = methodFilter === m;
              return (
                <button key={m} onClick={() => setMethodFilter(m)} style={{
                  padding: '5px 10px', fontSize: 10, borderRadius: 5, cursor: 'pointer', letterSpacing: '0.06em',
                  fontFamily: 'var(--mono)', transition: 'all 0.15s',
                  background: active ? `${c}20` : 'var(--bg3)',
                  border: active ? `1px solid ${c}50` : '1px solid var(--border)',
                  color: active ? c : 'var(--text3)',
                }}>{m}</button>
              );
            })}
          </div>

          {logs.length > 0 && (
            <button onClick={handleClear} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', fontSize: 10,
              background: 'rgba(255,68,102,0.06)', border: '1px solid rgba(255,68,102,0.2)',
              borderRadius: 6, color: '#ff4466', cursor: 'pointer', fontFamily: 'var(--mono)',
            }}>
              <Trash2 size={11} /> CLEAR
            </button>
          )}
        </div>

        {/* Log table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: 11 }}>Loading logs...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>No logs match current filters</div>
            </div>
          ) : (
            <>
              {/* Terminal header */}
              <div style={{ padding: '9px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {['red', '#ffaa00', '#00ffaa'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.5 }} />)}
                <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 8, fontFamily: 'var(--mono)' }}>
                  shield-express · request.log · {filtered.length} entries
                </span>
              </div>

              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['TIME', 'IP', 'METHOD', 'URL', 'UA'].map(h => (
                        <th key={h} style={{ padding: '9px 14px', fontSize: 9, color: 'var(--text3)', textAlign: 'left', letterSpacing: '0.1em', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log, i) => {
                      const mc = METHOD_COLORS[log.method] || 'var(--text2)';
                      return (
                        <motion.tr key={i}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.01, 0.3) }}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '8px 14px', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Clock size={9} />
                              {fmtTime(log.timestamp)}
                            </div>
                          </td>
                          <td style={{ padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                            {(log.ip || '').replace('::ffff:', '')}
                          </td>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: mc, background: `${mc}15`, border: `1px solid ${mc}30`, padding: '2px 7px', borderRadius: 3, fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>
                              {log.method}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--mono)' }} title={log.url}>
                            {log.url}
                          </td>
                          <td style={{ padding: '8px 14px', fontSize: 10, color: 'var(--text3)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.userAgent}>
                            {log.userAgent ? log.userAgent.slice(0, 30) + (log.userAgent.length > 30 ? '…' : '') : '—'}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
