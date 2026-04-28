const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/logs', dashboardController.getLogs);
router.get('/blocked-ips', dashboardController.getBlockedIps);
router.delete('/blocked-ips/:ip', dashboardController.unblockIp);
router.get('/threats', dashboardController.getThreats);
router.get('/summary', dashboardController.getSummary);

module.exports = router;
