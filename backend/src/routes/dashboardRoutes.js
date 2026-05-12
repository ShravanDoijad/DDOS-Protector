const express = require('express');
const router = express.Router();
const {
  getSummary, getLogs, clearLogs, getThreats,
  getBlockedIps, unblockIp, blockIp, health,
} = require('../controllers/dashboardController');

router.get('/health', health);
router.get('/summary', getSummary);
router.get('/logs', getLogs);
router.delete('/logs', clearLogs);
router.get('/Threats', getThreats);
router.get('/blocked-ips', getBlockedIps);
router.delete('/blocked-ips/:ip', unblockIp);
router.post('/blocked-ips', blockIp);

module.exports = router;
