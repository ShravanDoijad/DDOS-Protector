import { useLiveData } from '../hooks/useLiveData';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import { TrafficChart, ThreatScoreChart } from '../charts/Charts';
import { Activity, ShieldBan, AlertTriangle, Zap, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: '#00ffaa', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '0.1em' }}>CONNECTING...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.15em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#00ffaa' }}>■</span>
      {children.toUpperCase()}
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, error, refetch, lastUpdated } = useLiveData(api.getSummary, 4000);
  const { data: threats } = useLiveData(api.Threats, 6000);

  const alerts = [];
  if (data?.threats > 0) alerts.push(`${data.threats} active threats detected`);
  if (data?.blocked > 10) alerts.push(`${data.blocked} IPs currently blocked`);
  if (data?.rps > 50) alerts.push(`High traffic: ${data.rps} req/s`);

  if (loading) return <Loader />;

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 32, color: '#ff4466' }}>⚠</div>
      <div style={{ fontSize: 12, color: 'var(--text2)' }}>Backend unreachable</div>
      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', maxWidth: 300, textAlign: 'center' }}>{error}</div>
      <button onClick={refetch} style={{
        marginTop: 8, padding: '7px 16px', background: 'rgba(0,255,170,0.08)',
        border: '1px solid rgba(0,255,170,0.3)', borderRadius: 6, color: '#00ffaa',
        fontSize: 11, cursor: 'pointer',
      }}>RETRY</button>
    </div>
  );

  const topIps = data?.topIps || [];
  const methodBreakdown = data?.methodBreakdown || {};
  const methods = Object.entries(methodBreakdown);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        title="Security Overview"
        subtitle="Real-time shield-express monitoring"
        alerts={alerts}
        onRefresh={refetch}
        lastUpdated={lastUpdated}
      />

      <div style={{ padding: '24px 28px', flex: 1 }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          <StatCard title="Total Requests" value={data?.requests ?? 0} color="blue" icon={Activity} sub="since startup" />
          <StatCard title="Blocked IPs" value={data?.blocked ?? 0} color="red" icon={ShieldBan} sub="active blocks" />
          <StatCard title="Active Threats" value={data?.threats ?? 0} color="yellow" icon={AlertTriangle} sub="scoring > 0" />
          <StatCard title="Requests / sec" value={data?.rps ?? 0} color="green" icon={Zap} sub="10s rolling avg" />
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {/* Traffic chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <SectionTitle>Live Traffic</SectionTitle>
            <div style={{ height: 200 }}>
              <TrafficChart liveRps={data?.rps ?? 0} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text3)' }}>
                <div style={{ width: 20, height: 2, background: '#00ffaa' }} /> req/s
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text3)' }}>
                <div style={{ width: 20, height: 2, background: '#ff4466' }} /> blocked
              </div>
            </div>
          </div>

          {/* Threat scores chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <SectionTitle>Threat Score Distribution</SectionTitle>
            <div style={{ height: 200 }}>
              <ThreatScoreChart threats={threats || []} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 10 }}>
              {threats?.length ?? 0} IPs with active scores · max {threats?.reduce((m, t) => Math.max(m, t.score || 0), 0) ?? 0}
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {/* Top attacking IPs */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <SectionTitle>Top Attack Sources</SectionTitle>
            {topIps.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: '24px 0' }}>
                <ShieldBan size={24} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
                No active attackers
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {topIps.slice(0, 6).map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 9, color: 'var(--text3)', width: 14 }}>{i + 1}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)' }}>{item.ip}</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#ff4466', fontFamily: 'var(--mono)' }}>{item.count}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Method breakdown */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <SectionTitle>HTTP Methods</SectionTitle>
            {methods.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: '24px 0' }}>No data</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {methods.map(([method, count], i) => {
                  const total = methods.reduce((s, [, c]) => s + c, 0);
                  const pct = total ? Math.round((count / total) * 100) : 0;
                  const mc = { GET: '#00ffaa', POST: '#00d4ff', PUT: '#ffaa00', DELETE: '#ff4466' };
                  const c = mc[method] || 'var(--text2)';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: c, fontFamily: 'var(--mono)' }}>{method}</span>
                        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{count} · {pct}%</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{ height: '100%', background: c, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <SectionTitle>Recent Activity</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(data?.recentRequests || []).slice(0, 7).map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: 'var(--text3)' }}>
                  <Clock size={9} />
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--text2)', minWidth: 70 }}>
                    {log.ip?.replace('::ffff:', '').slice(-8) || '?'}
                  </span>
                  <span style={{ color: log.method === 'GET' ? '#00ffaa' : log.method === 'POST' ? '#00d4ff' : '#ffaa00', minWidth: 30 }}>
                    {log.method}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80 }}>
                    {log.url}
                  </span>
                </div>
              ))}
              {(!data?.recentRequests || data.recentRequests.length === 0) && (
                <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: '24px 0' }}>No requests logged</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
