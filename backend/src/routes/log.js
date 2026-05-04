const { getLogs } = require('../controllers/logController');
const express = require('express');
const router = express.Router();

router.get('/logs', getLogs);

module.exports = router;