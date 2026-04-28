import axios from "axios";

export const api = {
  getSummary: async () => {
    try {
      const response = await axios.get("/dashboard/summary");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch summary");
    }
  },
  getLogs: async () => {
    try {
      const response = await axios.get("/dashboard/logs");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch logs");
    }
  },
  getThreats: async () => {
    try {
      const response = await axios.get("/dashboard/threats");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch threats");
    }
  },
  getBlockedIps: async () => {
    try {
      const response = await axios.get("/dashboard/blocked-ips");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch blocked IPs");
    }
  },
  unblockIp: async (ip) => {
    try {
      const response = await axios.delete(`/dashboard/blocked-ips/${encodeURIComponent(ip)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || `Failed to unblock IP ${ip}`);
    }
  },
};
