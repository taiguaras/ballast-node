const express = require('express');
const authRoutes = require('./authRoutes');
const indicationRoutes = require('./indicationRoutes');
const fileRoutes = require('./fileRoutes');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/indications', indicationRoutes);
router.use('/file', fileRoutes);

module.exports = router; 