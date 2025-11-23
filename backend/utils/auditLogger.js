const db = require('../config/database');

/**
 * Log audit action
 * @param {number} userId - User performing the action
 * @param {string} action - Action description
 * @param {object} details - Additional details
 */
const logAuditAction = async (userId, action, details = {}) => {
    try {
        // Validate inputs
        if (!userId || !action) {
            console.warn('Audit logging skipped: Missing userId or action');
            return;
        }

        // Ensure details is an object
        const sanitizedDetails = details || {};
        
        // Insert the audit log
        await db.query(
            'INSERT INTO audit_log (user_id, action, details) VALUES (?, ?, ?)',
            [userId, action, JSON.stringify(sanitizedDetails)]
        );
    } catch (error) {
        console.error('Audit logging error:', error.message);
        // Don't throw error to avoid breaking main functionality
    }
};

/**
 * Log user login
 */
const logUserLogin = async (userId, email, success = true) => {
    return logAuditAction(userId, success ? 'USER_LOGIN' : 'USER_LOGIN_FAILED', {
        email,
        success,
        timestamp: new Date().toISOString()
    });
};

/**
 * Log user logout
 */
const logUserLogout = async (userId) => {
    return logAuditAction(userId, 'USER_LOGOUT', {
        timestamp: new Date().toISOString()
    });
};

module.exports = { 
    logAuditAction,
    logUserLogin,
    logUserLogout
};