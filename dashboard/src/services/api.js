import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const http = axios.create({
  baseURL: BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_API_KEY && { 'x-api-key': import.meta.env.VITE_API_KEY }),
  },
});

export const api = {
  // Dashboard summary — /api/dashboard/summary
  getSummary: async () => {
    const r = await http.get('/api/dashboard/summary');
    return r.data;
  },

  // Request logs — /api/dashboard/logs
  getLogs: async () => {
    const r = await http.get('/api/dashboard/logs');
    return r.data;
  },

  // Active threats (IPs with score > 0) — /api/dashboard/threats
  Threats: async () => {
    const r = await http.get('/api/dashboard/Threats');
    return r.data;
  },

  // Blocked IPs — /api/dashboard/blocked-ips
  getBlockedIps: async () => {
    const r = await http.get('/api/dashboard/blocked-ips');
    return r.data;
  },

  // Unblock an IP
  unblockIp: async (ip) => {
    const r = await http.delete(`/api/dashboard/blocked-ips/${encodeURIComponent(ip)}`);
    return r.data;
  },

  // Manually block an IP
  blockIp: async (ip, duration = 3600) => {
    const r = await http.post('/api/dashboard/blocked-ips', { ip, duration });
    return r.data;
  },

  // Clear logs
  clearLogs: async () => {
    const r = await http.delete('/api/dashboard/logs');
    return r.data;
  },

  // Health check
  health: async () => {
    const r = await http.get('/api/dashboard/health');
    return r.data;
  },
};
