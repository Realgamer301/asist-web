const fs = require('fs');
const path = require('path');

// Log file location (relative to utils folder)
const LOG_FILE = path.join(__dirname, '..', 'logs', 'app.log');

// Ensure the logs directory exists
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

function format(level, message) {
    const ts = new Date().toISOString();
    return `[${ts}] [${level}] ${message}\n`;
}

function info(message) {
    fs.appendFileSync(LOG_FILE, format('INFO', message));
}

function error(message) {
    fs.appendFileSync(LOG_FILE, format('ERROR', message));
}

module.exports = { info, error };
