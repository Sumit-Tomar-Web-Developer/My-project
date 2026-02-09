const express = require('express');
const router = express.Router();
const healthCheckController = require('../controllers/healthCheck.controller');

router.get('/ping', healthCheckController.ping);

module.exports = router;