import { useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border2)',
      borderRadius: 6, padding: '8px 12px', fontSize: 11, fontFamily: 'var(--mono)',
    }}>
      <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export function TrafficChart({ liveRps = 0 }) {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      t: `${i}s`, rps: 0, blocked: 0,
    }))
  );

  useEffect(() => {
    setData(prev => {
      const next = [...prev.slice(1), {
        t: new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rps: liveRps,
        blocked: Math.random() > 0.85 ? Math.floor(Math.random() * 3) : 0,
      }];
      return next;
    });
  }, [liveRps]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ffaa" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00ffaa" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="blockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff4466" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ff4466" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis dataKey="t" stroke="var(--text3)" tick={{ fontSize: 9, fontFamily: 'var(--mono)' }} tickLine={false} axisLine={false} interval={4} />
        <YAxis stroke="var(--text3)" tick={{ fontSize: 9, fontFamily: 'var(--mono)' }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="rps" name="req/s" stroke="#00ffaa" strokeWidth={1.5} fill="url(#rpsGrad)" dot={false} />
        <Area type="monotone" dataKey="blocked" name="blocked" stroke="#ff4466" strokeWidth={1.5} fill="url(#blockGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ThreatScoreChart({ threats = [] }) {
  const data = threats.slice(0, 10).map(t => ({
    ip: t.ip?.slice(-7) || '?',
    score: t.score || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis dataKey="ip" stroke="var(--text3)" tick={{ fontSize: 9, fontFamily: 'var(--mono)' }} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text3)" tick={{ fontSize: 9, fontFamily: 'var(--mono)' }} tickLine={false} axisLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="score" name="threat score" stroke="#ffaa00" strokeWidth={2} dot={{ fill: '#ffaa00', r: 3, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
