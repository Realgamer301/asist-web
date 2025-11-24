const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Unified logger
const logger = require('../backend/utils/logger');

// Route imports
const authRoutes = require('../backend/routes/authRoutes');
const sessionRoutes = require('../backend/routes/sessionRoutes');
const attendanceRoutes = require('../backend/routes/attendanceRoutes');
const centerRoutes = require('../backend/routes/centerRoutes');
const adminRoutes = require('../backend/routes/adminRoutes');
const backupRoutes = require('../backend/routes/backupRoutes');
const logRoutes = require('../backend/routes/logRoutes');

const app = express();

/* ---------- Middleware ---------- */
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://your-domain.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Request logging ---------- */
app.use((req, res, next) => {
    logger.info(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

/* ---------- Routes ---------- */
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/centers', centerRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/backups', backupRoutes);
app.use('/log', logRoutes);

/* ---------- Health check ---------- */
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Attendance System API is running',
        timestamp: new Date().toISOString()
    });
});

/* ---------- 404 handler ---------- */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

/* ---------- Error handler ---------- */
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

module.exports = app;
