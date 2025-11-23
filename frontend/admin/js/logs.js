// Logs page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = window.api.getUser();
    if (!window.api.isAuthenticated() || !user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Update user info in sidebar
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();

    // Set current date
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        window.api.logout();
        window.location.href = 'index.html';
    });

    // Load initial data
    loadUsers();
    loadLogs();

    // Event listeners
    document.getElementById('apply-filters').addEventListener('click', loadLogs);
    document.getElementById('refresh-logs').addEventListener('click', loadLogs);

    // Enter key on filters
    ['start-date', 'end-date', 'action-filter'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadLogs();
            }
        });
    });
});

async function loadUsers() {
    try {
        const response = await window.api.makeRequest('GET', '/admin/users');
        if (response.success) {
            const userSelect = document.getElementById('user-filter');
            response.data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} (${user.email})`;
                userSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadLogs() {
    const tbody = document.getElementById('logs-table-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                <div class="loading-spinner"></div>
                Loading logs...
            </td>
        </tr>
    `;

    try {
        const params = new URLSearchParams();

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const userId = document.getElementById('user-filter').value;
        const action = document.getElementById('action-filter').value.trim();
        const limit = document.getElementById('limit').value;

        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (userId) params.append('user_id', userId);
        if (action) params.append('action', action);
        if (limit) params.append('limit', limit);

        const response = await window.api.makeRequest('GET', `/admin/audit-logs?${params}`);

        if (response.success) {
            displayLogs(response.data);
        } else {
            showAlert('Failed to load logs', 'error');
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-gray">
                        Failed to load logs
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading logs:', error);
        showAlert(error.message || 'Error loading logs', 'error');
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-gray">
                    Error loading logs
                </td>
            </tr>
        `;
    }
}

function displayLogs(logs) {
    const tbody = document.getElementById('logs-table-body');

    if (logs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-gray">
                    No logs found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = logs.map(log => {
        const timestamp = new Date(log.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const userDisplay = log.user_name
            ? `${log.user_name} (${log.user_email})`
            : 'Unknown User';

        const details = formatDetails(log.details);

        return `
            <tr>
                <td>${timestamp}</td>
                <td>${userDisplay}</td>
                <td><span class="action-badge">${log.action}</span></td>
                <td>${details}</td>
            </tr>
        `;
    }).join('');
}

function formatDetails(detailsJson) {
    try {
        const details = JSON.parse(detailsJson);
        const entries = Object.entries(details);

        if (entries.length === 0) {
            return '<span class="text-gray">No details</span>';
        }

        return entries.map(([key, value]) => {
            const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `<strong>${displayKey}:</strong> ${value}`;
        }).join('<br>');
    } catch (error) {
        return '<span class="text-gray">Invalid details</span>';
    }
}

function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'error' ? 'alert-error' : 'alert-success';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}