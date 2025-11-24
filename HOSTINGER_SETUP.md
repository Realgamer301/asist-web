# Assistant Attendance System - Hostinger Setup Guide

Complete step-by-step guide to deploy the Assistant Attendance System on Hostinger.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Hostinger Setup](#initial-hostinger-setup)
3. [Database Setup](#database-setup)
4. [Application Deployment](#application-deployment)
5. [Backend Configuration](#backend-configuration)
6. [Frontend Configuration](#frontend-configuration)
7. [Verification & Testing](#verification--testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Active Hostinger account with hosting plan
- SSH access enabled
- MySQL database access
- Node.js runtime support (or compiled backend)
- FTP/SFTP client (FileZilla recommended)
- Terminal/Command Prompt access on your local machine

---

## Initial Hostinger Setup

### Step 1: Access Hostinger Control Panel

1. Log in to your Hostinger account at https://hostinger.com
2. Navigate to **Hosting** → Select your hosting plan
3. Click **Manage** to access the control panel

### Step 2: Create Directories

1. Go to **File Manager** in the control panel
2. Navigate to the `public_html` directory
3. Create the following folder structure:
   ```
   public_html/
   ├── app/              (backend)
   ├── client/           (frontend - admin portal)
   ├── assistant-app/    (frontend - assistant PWA)
   └── database/         (database files & backups)
   ```

4. Create folder permissions:
   - Right-click each folder → **Permissions**
   - Set to `755` (Owner: read/write/execute, Others: read/execute)

### Step 3: Enable SSH Access

1. In Hostinger control panel, go to **SSH Access**
2. Click **Manage** → **Enable SSH**
3. Note your SSH credentials:
   - Host: (provided by Hostinger)
   - Port: (usually 22)
   - Username: (your cPanel username)
   - Password: (your cPanel password)

---

## Database Setup

### Step 1: Create MySQL Database

1. In Hostinger control panel, go to **Databases**
2. Click **Create Database**
3. Fill in:
   - **Database Name**: `attendance_system`
   - **Database User**: `asist_user`
   - **Password**: (generate a strong password)
4. Click **Create Database**
5. Note the credentials for later use

### Step 2: Create Database User

1. Go to **Database Users**
2. Click **Create User**
3. Fill in:
   - **Username**: `asist_user`
   - **Password**: (same as above)
4. Assign user to `attendance_system` database with **All Privileges**

### Step 3: Import Database Schema

#### Option A: Using phpMyAdmin

1. Go to **Databases** → **Manage** (for your database)
2. Click **phpMyAdmin**
3. Select the `attendance_system` database
4. Click **Import**
5. Upload and run these SQL files in order:
   - `database/schema.sql`
   - `database/migrations/001_update_sessions_table.sql`
   - `database/migrations/002_add_recurring_sessions.sql`
   - `database/migrations/003_create_audit_log_table.sql`
   - `database/migrations/004_add_notes_to_attendance.sql`
   - `database/seed.sql` (optional - adds test data)

#### Option B: Using SSH (Recommended)

1. Connect via SSH using your credentials
2. Upload SQL files to your hosting
3. Run commands:
   ```bash
   mysql -u asist_user -p attendance_system < schema.sql
   mysql -u asist_user -p attendance_system < migrations/001_update_sessions_table.sql
   mysql -u asist_user -p attendance_system < migrations/002_add_recurring_sessions.sql
   mysql -u asist_user -p attendance_system < migrations/003_create_audit_log_table.sql
   mysql -u asist_user -p attendance_system < migrations/004_add_notes_to_attendance.sql
   mysql -u asist_user -p attendance_system < seed.sql
   ```

---

## Application Deployment

### Step 1: Upload Backend Files

1. **Via FTP/SFTP:**
   - Connect to Hostinger using FileZilla or similar
   - Upload `backend/` folder contents to `public_html/app/`
   - Ensure these files are uploaded:
     - `package.json`
     - `server.js`
     - `config/` directory
     - `controllers/` directory
     - `routes/` directory
     - `middleware/` directory
     - `utils/` directory

2. **Via SSH:**
   ```bash
   sftp your_username@your-hostinger-host
   cd public_html/app
   put -r backend/* .
   ```

### Step 2: Install Backend Dependencies

1. Connect via SSH
2. Navigate to backend directory:
   ```bash
   cd public_html/app
   ```
3. Install Node.js packages:
   ```bash
   npm install
   ```
   
   This installs all packages from `package.json`

### Step 3: Create Environment File

1. Create `.env` file in `public_html/app/`:
   ```bash
   nano .env
   ```

2. Add the following configuration:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_USER=asist_user
   DB_PASSWORD=your_password_here
   DB_NAME=attendance_system
   DB_PORT=3306

   # Server Configuration
   NODE_ENV=production
   PORT=3000

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
   JWT_EXPIRY=7d

   # Session Configuration
   SESSION_TIMEOUT=3600000

   # GPS Configuration
   GPS_RADIUS_METERS=30
   GPS_ACCURACY_THRESHOLD=50

   # API Configuration
   API_URL=https://your-domain.com/api
   FRONTEND_URL=https://your-domain.com

   # Logging
   LOG_LEVEL=info
   ```

3. Save file (Ctrl+O, Enter, Ctrl+X)

### Step 4: Setup Process Manager (Recommended)

Use PM2 to keep the backend running:

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Create `ecosystem.config.js` in `public_html/app/`:
   ```bash
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'attendance-backend',
       script: './server.js',
       instances: 1,
       exec_mode: 'cluster',
       watch: false,
       max_memory_restart: '500M',
       env: {
         NODE_ENV: 'production'
       },
       error_file: './logs/error.log',
       out_file: './logs/out.log',
       log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
     }]
   };
   EOF
   ```

3. Start the application:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. Verify it's running:
   ```bash
   pm2 status
   pm2 logs attendance-backend
   ```

---

## Frontend Configuration

### Step 1: Upload Admin Frontend

1. Upload contents of `frontend/admin/` to `public_html/client/`
2. Create subdirectories as needed:
   - `css/`
   - `js/`
   - Ensure `index.html` is in the root

### Step 2: Upload Assistant Frontend

1. Upload contents of `frontend/assistant/` to `public_html/assistant-app/`
2. Includes:
   - `index.html`
   - `manifest.json` (PWA support)
   - `sw.js` (Service Worker)
   - `css/` and `js/` directories

### Step 3: Upload Shared Resources

1. Upload `frontend/shared/` contents to both locations:
   - Copy `js/api.js` to both `client/js/` and `assistant-app/js/`
   - Copy `css/common.css` to both `client/css/` and `assistant-app/css/`

### Step 4: Configure API Endpoints

1. Edit `js/api.js` in both frontend directories
2. Update API base URL:
   ```javascript
   const API_BASE_URL = 'https://your-domain.com/app/api';
   ```

3. Update in `client/js/api.js` and `assistant-app/js/api.js`

---

## SSL Certificate Configuration

### Step 1: Enable Free SSL

1. In Hostinger control panel, go to **SSL**
2. Click **Free SSL Certificate** → **Enable**
3. Wait 5-15 minutes for activation
4. Verify it's active with a green padlock

### Step 2: Force HTTPS

1. Go to **SSL** → **HTTPS Redirect**
2. Enable **Force HTTPS** option
3. This redirects all HTTP traffic to HTTPS

---

## Create SSL Certificates for Backend (Optional)

If you need client certificates for secure API communication:

1. Via SSH, generate certificates:
   ```bash
   cd public_html/app
   openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
   ```

2. Follow the prompts to generate certificate
3. Update `server.js` if using HTTPS

---

## Verify Backend is Running

### Step 1: Test API Endpoint

1. Open terminal/command prompt
2. Test the backend:
   ```bash
   curl https://your-domain.com/app/api/health
   ```

3. Should return:
   ```json
   {"status": "ok"}
   ```

### Step 2: Test Authentication

```bash
curl -X POST https://your-domain.com/app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

---

## Frontend Verification

### Step 1: Access Admin Portal

1. Open browser and go to: `https://your-domain.com/client/`
2. You should see the login page
3. Default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

### Step 2: Access Assistant App

1. Open browser and go to: `https://your-domain.com/assistant-app/`
2. You should see the assistant login page
3. Can be installed as PWA (click "Install" in address bar)

---

## Setup Custom Domain

### Step 1: Point Domain to Hostinger

1. In your domain registrar (GoDaddy, Namecheap, etc.):
2. Update DNS nameservers to:
   - `ns1.hostinger.com`
   - `ns2.hostinger.com`
   - `ns3.hostinger.com`
   - `ns4.hostinger.com`

3. Wait 24-48 hours for propagation

### Step 2: Add Domain in Hostinger

1. In Hostinger control panel, go to **Domains**
2. Click **Add Domain**
3. Select **I already own this domain**
4. Enter your domain name
5. Set document root to `public_html`

### Step 3: Configure DNS (if needed)

1. Go to **DNS** in Hostinger
2. Add these records:
   ```
   Type: A
   Name: @
   Value: (Hostinger IP provided)
   
   Type: A
   Name: www
   Value: (Hostinger IP provided)
   ```

3. Wait for DNS propagation (usually 24 hours)

---

## Performance Optimization

### Step 1: Enable Caching

1. In Hostinger, go to **Caching**
2. Enable **Browser Caching**
3. Set cache expiration:
   - Static files: 30 days
   - HTML: 1 hour

### Step 2: Enable Compression

1. In Hostinger, go to **GZIP**
2. Enable **GZIP Compression**
3. This reduces file sizes by 70%

### Step 3: Database Optimization

Connect via SSH and run:
```bash
mysql -u asist_user -p attendance_system
OPTIMIZE TABLE attendance;
OPTIMIZE TABLE users;
OPTIMIZE TABLE sessions;
OPTIMIZE TABLE centers;
OPTIMIZE TABLE audit_log;
FLUSH TABLES;
EXIT;
```

---

## Backup Strategy

### Step 1: Automated Database Backups

1. In Hostinger control panel, go to **Backups**
2. Enable **Automatic Backups**
3. Set daily backups

### Step 2: Manual Database Backup

Via SSH:
```bash
mysqldump -u asist_user -p attendance_system > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 3: Manual Application Backup

1. Use FTP to download:
   - `public_html/app/` (backend)
   - `public_html/client/` (admin frontend)
   - `public_html/assistant-app/` (assistant frontend)

---

## Monitoring & Logs

### Step 1: View Application Logs

Via SSH:
```bash
cd public_html/app
pm2 logs attendance-backend
```

### Step 2: View Error Logs

```bash
tail -f logs/error.log
tail -f logs/app.log
```

### Step 3: Monitor System Resources

```bash
pm2 monit
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Verify database credentials in `.env`
2. Check database user privileges:
   ```bash
   mysql -u asist_user -p
   SHOW GRANTS FOR 'asist_user'@'localhost';
   ```
3. Ensure database exists:
   ```bash
   SHOW DATABASES;
   ```

### Issue: "Backend returns 404"

**Solution:**
1. Check if PM2 process is running:
   ```bash
   pm2 status
   ```
2. If not, restart:
   ```bash
   pm2 restart attendance-backend
   ```
3. Check logs:
   ```bash
   pm2 logs attendance-backend
   ```

### Issue: "CORS errors in browser console"

**Solution:**
1. Update `API_URL` in `frontend/shared/js/api.js`
2. Ensure it matches your Hostinger domain
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Cannot read file" errors

**Solution:**
1. Check file permissions:
   ```bash
   chmod 755 public_html/app
   chmod 644 public_html/app/*.js
   chmod 644 public_html/app/.env
   ```

### Issue: "SSL certificate not working"

**Solution:**
1. Go to Hostinger **SSL** panel
2. Click **Re-issue** for free SSL
3. Wait 10 minutes
4. Clear browser cache
5. Try incognito window

### Issue: "Frontend assets not loading"

**Solution:**
1. Verify files uploaded to correct directories
2. Check file paths in HTML files
3. Update paths to absolute URLs:
   ```html
   <!-- Before -->
   <script src="js/api.js"></script>
   
   <!-- After -->
   <script src="/client/js/api.js"></script>
   ```

---

## Post-Deployment Checklist

- [ ] Database migrated successfully
- [ ] Backend running with PM2
- [ ] Admin frontend accessible
- [ ] Assistant frontend accessible
- [ ] SSL certificate active (green padlock)
- [ ] Custom domain working
- [ ] API endpoints responding
- [ ] Login works with default credentials
- [ ] Automatic backups enabled
- [ ] Logs monitored

---

## Security Best Practices

1. **Change Default Credentials**
   - Update admin email/password after first login
   - Remove test accounts

2. **Secure .env File**
   ```bash
   chmod 600 .env
   chmod 600 key.pem
   chmod 600 cert.pem
   ```

3. **Update JWT Secret**
   - Generate strong random string
   - Update `JWT_SECRET` in `.env`

4. **Enable WAF (Web Application Firewall)**
   - In Hostinger, enable ModSecurity

5. **Regular Updates**
   - Keep Node.js packages updated:
     ```bash
     npm audit
     npm update
     ```

---

## Getting Help

- Check logs first: `pm2 logs`
- Review Hostinger support docs
- Check application GitHub repository
- Contact Hostinger support for hosting issues

---

**Last Updated:** November 24, 2025

