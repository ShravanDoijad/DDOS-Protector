import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldBan, Activity, FileText, Settings, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const nav = [
  { name: 'Overview', path: '/', icon: LayoutDashboard, key: 'overview' },
  { name: 'Threats', path: '/threats', icon: Activity, key: 'threats' },
  { name: 'Blocked IPs', path: '/blocked', icon: ShieldBan, key: 'blocked' },
  { name: 'Logs', path: '/logs', icon: FileText, key: 'logs' },
  { name: 'Settings', path: '/settings', icon: Settings, key: 'settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const [online, setOnline] = useState(true);
  const [uptime, setUptime] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const check = async () => {
      try { await api.health(); setOnline(true); } catch { setOnline(false); }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setUptime(p => p + 1);
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: 'rgba(0,255,170,0.1)',
            border: '1px solid rgba(0,255,170,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#00ffaa" strokeWidth="1.5" fill="none"/>
              <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="rgba(0,255,170,0.3)" stroke="#00ffaa" strokeWidth="1"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 16, color: '#00ffaa', letterSpacing: '0.05em' }}>SHIELD</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.15em' }}>SECURITY CONSOLE</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          {time.toISOString().slice(0, 19).replace('T', ' ')}Z
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(item => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 6,
              textDecoration: 'none',
              background: active ? 'rgba(0,255,170,0.08)' : 'transparent',
              border: active ? '1px solid rgba(0,255,170,0.2)' : '1px solid transparent',
              color: active ? '#00ffaa' : 'var(--text2)',
              transition: 'all 0.15s',
              fontSize: 12,
              fontFamily: 'var(--mono)',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; } }}
            >
              {active && <span style={{ color: '#00ffaa', fontSize: 10 }}>›</span>}
              <Icon size={14} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em' }}>BACKEND</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: online ? '#00ffaa' : '#ff4466',
              boxShadow: online ? '0 0 6px #00ffaa' : '0 0 6px #ff4466',
            }} />
            <Wifi size={10} color={online ? '#00ffaa' : '#ff4466'} />
            <span style={{ fontSize: 10, color: online ? '#00ffaa' : '#ff4466' }}>{online ? 'LIVE' : 'DOWN'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>UPTIME</span>
          <span style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{fmt(uptime)}</span>
        </div>
        <div style={{
          fontSize: 9, color: 'var(--text3)', marginTop: 4,
          padding: '6px 8px', background: 'var(--bg3)', borderRadius: 4,
          border: '1px solid var(--border)', letterSpacing: '0.05em',
        }}>
          v1.0.0 · shield-express
        </div>
      </div>
    </aside>
  );
}
