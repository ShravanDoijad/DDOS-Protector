const WEBHOOK = process.env.ALERT_WEBHOOK_URL;
const MIN_SEV = process.env.ALERT_MIN_SEVERITY || 'high';
const SEV = { low: 1, medium: 2, high: 3 };
const recent = new Map();

const sendAlert = async ({ ip, event, severity, detail }, configWebhook = null) => {
  // Use config webhook if provided, otherwise fallback to env
  const activeWebhook = configWebhook || WEBHOOK;
  
  if (!activeWebhook) return;
  if ((SEV[severity] || 0) < SEV[MIN_SEV]) return;
  
  const key = `${ip}:${event}`;
  if (Date.now() - (recent.get(key) || 0) < 300000) return; // 5min debounce
  recent.set(key, Date.now());

  const colors = { high: 0xE24B4A, medium: 0xBA7517, low: 0x378ADD };
  const payload = {
    embeds: [{ 
      title: `Shield.js — ${event}`, 
      description: detail, 
      color: colors[severity],
      fields: [
        { name: 'IP', value: ip, inline: true }, 
        { name: 'Severity', value: severity.toUpperCase(), inline: true }
      ]
    }]
  };

  try {
    // Using native Node.js fetch api instead of axios to avoid extra dependencies
    await fetch(activeWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000)
    });
  } catch (err) {
    // Ignore timeout or network errors silently to not block the event loop
  }
};

module.exports = { sendAlert };
