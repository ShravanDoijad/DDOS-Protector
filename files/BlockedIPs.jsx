import { useState } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { api } from '../services/api';
import TopBar from '../components/TopBar';
import { ShieldBan, Unlock, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const toastStyle = { style: { background: '#0d1117', color: '#00ffaa', border: '1px solid rgba(0,255,170,0.3)', fontFamily: 'var(--mono)', fontSize: 12 } };
const toastErrStyle = { style: { background: '#0d1117', color: '#ff4466', border: '1px solid rgba(255,68,102,0.3)', fontFamily: 'var(--mono)', fontSize: 12 } };

export default function BlockedIPs() {
  const { data: ips, loading, error, refetch, lastUpdated } = useLiveData(api.getBlockedIps, 5000);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [duration, setDuration] = useState(3600);

  const handleUnblock = async (ip) => {
    try {
      await api.unblockIp(ip);
      toast.success(`${ip} unblocked`, toastStyle);
      refetch();
    } catch { toast.error(`Failed to unblock ${ip}`, toastErrStyle); }
  };

  const handleBlock = async () => {
    if (!newIp.trim()) return;
    try {
      await api.blockIp(newIp.trim(), duration);
      toast.success(`${newIp} blocked`, toastStyle);
      setNewIp(''); setShowAdd(false); refetch();
    } catch { toast.error('Failed to block IP', toastErrStyle); }
  };

  const list = (Array.isArray(ips) ? ips : [])
    .filter(ip => (typeof ip === 'string' ? ip : ip?.ip || '').toLowerCase().includes(search.toLowerCase()));

  const inputStyle = {
    background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 6,
    color: 'var(--text)', fontSize: 12, fontFamily: 'var(--mono)', padding: '7px 12px',
    outline: 'none', width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Blocked IPs" subtitle={`${list.length} addresses on blocklist`} onRefresh={refetch} lastUpdated={lastUpdated} />

      <div style={{ padding: '24px 28px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IP address..."
              style={{ ...inputStyle, paddingLeft: 32 }} />
          </div>
          <button onClick={() => setShowAdd(p => !p)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.3)',
            borderRadius: 6, color: '#00ffaa', fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--mono)', letterSpacing: '0.05em',
          }}>
            <Plus size={12} /> ADD BLOCK
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 16, background: 'var(--surface)', border: '1px solid rgba(0,255,170,0.2)', borderRadius: 10, padding: 18, overflow: 'hidden' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 14 }}>■ MANUAL BLOCK</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'end' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5 }}>IP ADDRESS</div>
                  <input value={newIp} onChange={e => setNewIp(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleBlock()}
                    placeholder="e.g. 192.168.1.100" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5 }}>DURATION</div>
                  <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ ...inputStyle, width: 140 }}>
                    <option value={300}>5 minutes</option>
                    <option value={1800}>30 minutes</option>
                    <option value={3600}>1 hour</option>
                    <option value={86400}>24 hours</option>
                    <option value={604800}>7 days</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleBlock} style={{
                    padding: '7px 16px', background: '#ff4466', color: '#fff', border: 'none',
                    borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--mono)', letterSpacing: '0.05em',
                  }}>BLOCK</button>
                  <button onClick={() => setShowAdd(false)} style={{
                    padding: '7px 10px', background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                    borderRadius: 6, cursor: 'pointer',
                  }}><X size={12} /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: 11 }}>Loading...</div>
          ) : list.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <ShieldBan size={36} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.15, color: 'var(--text)' }} />
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{search ? 'No matching IPs' : 'Blocklist empty'}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>All traffic is currently allowed</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['#', 'IP ADDRESS', 'REASON', 'STATUS', 'ACTION'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', fontSize: 9, color: 'var(--text3)', textAlign: 'left', letterSpacing: '0.12em', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {list.map((item, i) => {
                    const ip = typeof item === 'string' ? item : item?.ip || '?';
                    const reason = typeof item === 'object' ? (item.reason || 'auto-blocked') : 'blocked';
                    return (
                      <motion.tr key={ip}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '11px 16px', fontSize: 10, color: 'var(--text3)' }}>{i + 1}</td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)', background: 'var(--bg3)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>{ip}</span>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                          {reason === 'honeypot' ? <span style={{ color: '#ffaa00' }}>honeypot trigger</span> :
                           reason === 'manual' ? <span style={{ color: '#00d4ff' }}>manual block</span> :
                           <span>{reason}</span>}
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 10, color: '#ff4466', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.25)', padding: '3px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>
                            BLOCKED
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <button onClick={() => handleUnblock(ip)} style={{
                            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', fontSize: 10,
                            background: 'rgba(0,255,170,0.05)', color: '#00ffaa',
                            border: '1px solid rgba(0,255,170,0.2)', borderRadius: 5,
                            cursor: 'pointer', fontFamily: 'var(--mono)', letterSpacing: '0.05em', transition: 'all 0.15s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#00ffaa'; e.currentTarget.style.color = '#000'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,170,0.05)'; e.currentTarget.style.color = '#00ffaa'; }}
                          >
                            <Unlock size={10} /> UNBLOCK
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
