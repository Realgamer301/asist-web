const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Path to the log file (same location used by logger.js)
const LOG_PATH = path.join(__dirname, '..', 'logs', 'app.log');

/**
 * GET /api/log?lines=200
 * Returns the last `lines` lines of the server log.
 * If the file does not exist, returns an error JSON.
 */
router.get('/', (req, res) => {
    const maxLines = parseInt(req.query.lines, 10) || 200;
    fs.readFile(LOG_PATH, 'utf8', (err, data) => {
        if (err) {
            logger.error(`Failed to read log file: ${err.message}`);
            return res.status(500).json({ success: false, message: 'Unable to read log file' });
        }
        const lines = data.trim().split('\n');
        const slice = lines.slice(-maxLines).join('\n');
        res.json({ success: true, data: slice });
    });
});

module.exports = router;
