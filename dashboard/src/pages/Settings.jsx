import { useState } from 'react';
import TopBar from '../components/TopBar';
import { Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const toastStyle = { style: { background: '#0d1117', color: '#00ffaa', border: '1px solid rgba(0,255,170,0.3)', fontFamily: 'var(--mono)', fontSize: 12 } };

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em' }}>
        <span style={{ color: '#00ffaa' }}>■</span> {title}
      </div>
      <div style={{ padding: '18px 20px' }}>{children}</div>
    </div>
  );
}

function Field({ label, desc, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
        {desc && <div style={{ fontSize: 10, color: 'var(--text3)' }}>{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 40, height: 22, borderRadius: 11, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
      background: value ? 'rgba(0,255,170,0.3)' : 'var(--bg3)',
      border: `1px solid ${value ? 'rgba(0,255,170,0.5)' : 'var(--border)'}`,
    }}>
      <div style={{ position: 'absolute', top: 2, left: value ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: value ? '#00ffaa' : 'var(--text3)', transition: 'left 0.2s', boxShadow: value ? '0 0 8px #00ffaa' : 'none' }} />
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 6,
  color: 'var(--text)', fontSize: 12, fontFamily: 'var(--mono)', padding: '7px 12px',
  outline: 'none', width: '100%',
};

export default function Settings() {
  const [cfg, setCfg] = useState({
    honeypot: true, botDetection: true, inputSanitizer: true, geoFilter: false,
    blockThreshold: 60, tempBlockThreshold: 40, slowdownThreshold: 20,
    defaultRateLimit: 300, loginRateLimit: 10, uploadRateLimit: 20,
    alertWebhook: '', allowedOrigins: 'http://localhost:5173',
    deniedCountries: '', allowedCountries: '',
  });

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    // In production: POST to /api/dashboard/config
    localStorage.setItem('shield_config', JSON.stringify(cfg));
    toast.success('Configuration saved', toastStyle);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Settings" subtitle="shield-express configuration" />

      <div style={{ padding: '24px 28px', maxWidth: 800 }}>
        <Section title="PROTECTION MODULES">
          <Field label="Honeypot routes" desc="Auto-block IPs that hit /.env, /wp-admin, etc.">
            <Toggle value={cfg.honeypot} onChange={v => set('honeypot', v)} />
          </Field>
          <Field label="Bot detection" desc="Detect scrapers, headless browsers, missing UA">
            <Toggle value={cfg.botDetection} onChange={v => set('botDetection', v)} />
          </Field>
          <Field label="Input sanitizer" desc="Scan requests for SQLi, XSS, path traversal">
            <Toggle value={cfg.inputSanitizer} onChange={v => set('inputSanitizer', v)} />
          </Field>
          <Field label="GeoIP filter" desc="Block or restrict by country code">
            <Toggle value={cfg.geoFilter} onChange={v => set('geoFilter', v)} />
          </Field>
        </Section>

        <Section title="THREAT THRESHOLDS">
          <Field label="Block threshold" desc="Score above this → 30min block">
            <input type="number" value={cfg.blockThreshold} onChange={e => set('blockThreshold', Number(e.target.value))} style={inputStyle} />
          </Field>
          <Field label="Temp block threshold" desc="Score above this → 5min block">
            <input type="number" value={cfg.tempBlockThreshold} onChange={e => set('tempBlockThreshold', Number(e.target.value))} style={inputStyle} />
          </Field>
          <Field label="Slow down threshold" desc="Score above this → 1.5s request delay">
            <input type="number" value={cfg.slowdownThreshold} onChange={e => set('slowdownThreshold', Number(e.target.value))} style={inputStyle} />
          </Field>
        </Section>

        <Section title="RATE LIMITS">
          <Field label="Default limit (req/min)" desc="Applied to all unspecified routes">
            <input type="number" value={cfg.defaultRateLimit} onChange={e => set('defaultRateLimit', Number(e.target.value))} style={inputStyle} />
          </Field>
          <Field label="/api/login limit (req/min)" desc="Stricter limit for auth endpoints">
            <input type="number" value={cfg.loginRateLimit} onChange={e => set('loginRateLimit', Number(e.target.value))} style={inputStyle} />
          </Field>
          <Field label="/api/upload limit (req/min)" desc="">
            <input type="number" value={cfg.uploadRateLimit} onChange={e => set('uploadRateLimit', Number(e.target.value))} style={inputStyle} />
          </Field>
        </Section>

        <Section title="GEO FILTER">
          <Field label="Denied countries" desc="Comma-separated ISO codes (e.g. KP,RU)">
            <input value={cfg.deniedCountries} onChange={e => set('deniedCountries', e.target.value)} placeholder="KP,RU" style={inputStyle} disabled={!cfg.geoFilter} />
          </Field>
          <Field label="Allowed countries only" desc="Empty = allow all. e.g. IN,US,GB">
            <input value={cfg.allowedCountries} onChange={e => set('allowedCountries', e.target.value)} placeholder="IN,US,GB" style={inputStyle} disabled={!cfg.geoFilter} />
          </Field>
        </Section>

        <Section title="ALERTS & CORS">
          <Field label="Webhook URL" desc="Discord / Slack webhook for threat alerts">
            <input value={cfg.alertWebhook} onChange={e => set('alertWebhook', e.target.value)} placeholder="https://discord.com/api/webhooks/..." style={inputStyle} />
          </Field>
          <Field label="Allowed origins" desc="Comma-separated CORS allowed origins">
            <input value={cfg.allowedOrigins} onChange={e => set('allowedOrigins', e.target.value)} style={inputStyle} />
          </Field>
        </Section>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px',
            background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.4)',
            borderRadius: 7, color: '#00ffaa', fontSize: 12, cursor: 'pointer',
            fontFamily: 'var(--mono)', letterSpacing: '0.06em',
          }}>
            <Save size={13} /> SAVE CONFIGURATION
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text3)' }}>
            <AlertTriangle size={11} />
            Changes apply on backend restart
          </div>
        </div>
      </div>
    </div>
  );
}
