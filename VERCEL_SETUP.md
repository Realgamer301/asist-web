# Vercel Deployment Guide - Assistant Attendance System

Complete step-by-step guide to deploy the Assistant Attendance System on Vercel with serverless functions.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Setup on GitHub](#setup-on-github)
4. [Database Setup](#database-setup)
5. [Vercel Project Creation](#vercel-project-creation)
6. [Environment Variables](#environment-variables)
7. [Deployment](#deployment)
8. [Custom Domain](#custom-domain)
9. [Monitoring](#monitoring)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have:

- GitHub account (https://github.com)
- Vercel account (https://vercel.com) - sign up with GitHub
- A compatible database:
  - **Option 1**: Cloud MySQL (PlanetScale, AWS RDS, Azure Database)
  - **Option 2**: MongoDB Atlas (if you migrate from SQL)
- Git installed locally
- Node.js 18+ installed
- Project repository set up

---

## Project Structure

Your project is now optimized for Vercel with this structure:

```
project-root/
├── api/
│   └── index.js                 # Main API handler (serverless function)
├── backend/
│   ├── server.js                # Original backend (for reference)
│   ├── package.json             # Updated for Vercel
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── logs/
├── frontend/
│   ├── admin/                   # Admin dashboard
│   ├── assistant/               # Assistant PWA
│   └── shared/                  # Shared resources
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── backups/
├── vercel.json                  # Vercel configuration
├── .vercelignore                # Files to ignore in deployment
├── .env.example                 # Environment variables template
├── package.json                 # Root package.json
└── README.md
```

---

## Setup on GitHub

### Step 1: Initialize Git Repository

If not already done:

```bash
cd c:\Users\PCM\Downloads\asist-web-main\asist-web-main
git init
git add .
git commit -m "Initial commit: Assistant Attendance System"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `assistant-attendance-system`
3. Choose:
   - Public or Private (choose Private for security)
   - Add .gitignore: Node
   - Add license: MIT (optional)
4. **DO NOT** initialize with README (we have one)

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/your-username/assistant-attendance-system.git
git branch -M main
git push -u origin main
```

### Step 4: Verify Repository

- Visit your GitHub repo
- Confirm all files are uploaded
- Check that `.vercelignore` is present

---

## Database Setup

Vercel doesn't support databases directly. You must use an external database service.

### Option A: PlanetScale (Recommended for MySQL)

**Most compatible with existing schema**

1. Create account at https://planetscale.com
2. Click **Create a new database**
3. Name: `attendance_system`
4. Region: Choose closest to users
5. Click **Create database**
6. Click **Connect** → **Node.js** tab
7. Copy connection string (looks like):
   ```
   mysql://xxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud:3306/attendance_system?sslaccept=strict
   ```
8. Extract credentials:
   - `DB_HOST`: `aws.connect.psdb.cloud`
   - `DB_USER`: (username from URL)
   - `DB_PASSWORD`: (password from URL)
   - `DB_NAME`: `attendance_system`
   - `DB_PORT`: `3306`

9. **Create schema**: Use PlanetScale's UI or upload SQL:
   - Go to **Branches** → **main**
   - Click **New Branch** → name it `schema`
   - Open branch and upload SQL files:
     1. `database/schema.sql`
     2. `database/migrations/001_update_sessions_table.sql`
     3. `database/migrations/002_add_recurring_sessions.sql`
     4. `database/migrations/003_create_audit_log_table.sql`
     5. `database/migrations/004_add_notes_to_attendance.sql`
   - After verification, **create pull request** and merge to main

### Option B: Azure Database for MySQL

1. Create account at https://azure.microsoft.com
2. Create **MySQL Flexible Server**
3. Configuration:
   - Compute + storage: Basic tier (dev/test)
   - MySQL version: 8.0+
   - Authentication: MySQL native password
4. Enable **Public access**
5. Add firewall rule: `0.0.0.0/0` (allow all - secure in production)
6. Note credentials:
   - `DB_HOST`: `your-server.mysql.database.azure.com`
   - `DB_USER`: `your-username`
   - `DB_PASSWORD`: (set during creation)
   - `DB_NAME`: `attendance_system`

7. Import schema using MySQL Workbench or command line

### Option C: AWS RDS MySQL

1. Create account at https://aws.amazon.com
2. Create **RDS MySQL Database**
3. Configuration:
   - Engine: MySQL 8.0.33 LTS
   - Template: Free tier
   - DB instance: db.t3.micro
   - Storage: 20 GB
4. Enable **Public accessibility**
5. Security group: Allow inbound on port 3306
6. Note credentials from "Connectivity & security" tab

7. Connect and import schema

---

## Vercel Project Creation

### Step 1: Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Search for `assistant-attendance-system`
5. Click **Import**

### Step 2: Configure Project

On the import page:

- **Framework Preset**: Other
- **Root Directory**: `./` (leave blank)
- **Build Command**: `npm run build`
- **Output Directory**: (leave empty)

Click **Deploy**

### Step 3: Wait for Build

- Initial build may take 2-5 minutes
- Monitor the build log
- Should complete with **READY** status

---

## Environment Variables

### Step 1: Add to Vercel

After initial deploy, go to **Project Settings**:

1. Navigate to **Settings** → **Environment Variables**
2. Add each variable:

```
DB_HOST=your-planetscale-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=attendance_system
DB_PORT=3306

JWT_SECRET=generate-a-random-string-min-32-chars

NODE_ENV=production

FRONTEND_URL=https://your-vercel-domain.vercel.app
API_URL=https://your-vercel-domain.vercel.app/api

LOG_LEVEL=info
GPS_RADIUS_METERS=30
```

3. For each variable, select environment:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments**
2. Click on latest deployment
3. Click **Redeploy** (or push to GitHub to trigger auto-deploy)
4. Wait for build to complete with new environment variables

---

## API Endpoint Testing

### Step 1: Get Your Vercel URL

1. In Vercel dashboard, click **Visit**
2. Copy the domain: `https://your-project.vercel.app`

### Step 2: Test Health Endpoint

```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Attendance System API is running",
  "timestamp": "2025-11-24T10:30:00.000Z"
}
```

### Step 3: Test Authentication

```bash
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Should return JWT token if credentials are correct.

---

## Custom Domain

### Step 1: Point Domain to Vercel

1. In **Project Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `example.com`
4. Follow instructions for your registrar

For most registrars:
- Point `A` record to: `76.76.19.132`
- Or update nameservers to Vercel's

### Step 2: Verify Domain

- Vercel will auto-detect when DNS propagates
- Usually 24-48 hours
- You'll see green checkmark when active

### Step 3: Enable SSL

- Automatically enabled via Vercel
- Free Let's Encrypt certificate
- Auto-renews

---

## Deployment Workflow

### Automatic Deployments

Every push to GitHub triggers automatic deployment:

```bash
# Make changes locally
git add .
git commit -m "Fix: Update API endpoint"
git push origin main
```

Vercel will:
1. Detect push
2. Run build command
3. Run tests (if configured)
4. Deploy to production
5. Notify on status

### Manual Deployments

From Vercel dashboard:
1. **Deployments** tab
2. Click existing deployment
3. Click **Redeploy**

### Preview Deployments

For pull requests:
1. Create branch: `git checkout -b feature/new-feature`
2. Make changes and push
3. Create pull request on GitHub
4. Vercel auto-creates preview deployment
5. Test on preview URL before merging

---

## Frontend Configuration

### Update API URLs

Update these files to use Vercel API:

**File: `frontend/shared/js/api.js`**

Change:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

To:
```javascript
const API_BASE_URL = 'https://your-domain.vercel.app/api';
```

**File: `frontend/admin/js/*.js`**

Search for any hardcoded URLs and update.

**File: `frontend/assistant/js/*.js`**

Same for assistant app.

### Update Service Worker (PWA)

**File: `frontend/assistant/sw.js`**

Ensure API calls use correct domain:
```javascript
const API_URL = 'https://your-domain.vercel.app/api';
```

---

## Monitoring & Logs

### View Logs

In Vercel dashboard:

1. Go to **Deployments**
2. Click on a deployment
3. Click **Logs**
4. Choose **Runtime Logs** (for API execution)

### Monitor Performance

1. Go to **Analytics**
2. View:
   - Request count
   - Response time
   - Error rate
   - Bandwidth usage

### Set Up Alerts

1. **Settings** → **Integrations**
2. Connect to Slack/Email
3. Get notified of:
   - Build failures
   - Deployment completions
   - Error thresholds

---

## Troubleshooting

### Issue: Build Fails with "npm install" Error

**Solution:**
1. Check `package.json` syntax
2. Delete `node_modules` locally
3. Run `npm install` locally to verify
4. Commit changes
5. Push to GitHub - Vercel will rebuild

### Issue: "Cannot connect to database"

**Solution:**
1. Verify environment variables in Vercel:
   - **Settings** → **Environment Variables**
   - Double-check all values
2. Test database connection locally:
   ```bash
   mysql -h your-host -u your-user -p your-password -e "SELECT 1"
   ```
3. Check database firewall:
   - PlanetScale: Allow all IPs
   - Azure: Add Vercel IP to firewall
   - AWS: Security group allows 3306

### Issue: "API returns 404"

**Solution:**
1. Check route paths in `backend/routes/*.js`
2. Routes should NOT include `/api` prefix:
   - ✅ Correct: `app.use('/auth', authRoutes)`
   - ❌ Wrong: `app.use('/api/auth', authRoutes)`
3. Routes are prefixed in `api/index.js`

### Issue: "CORS errors in browser console"

**Solution:**
1. Update `FRONTEND_URL` in Vercel environment variables
2. Check `api/index.js` CORS configuration
3. Add your domain to CORS origins:
   ```javascript
   origin: [
     'https://your-domain.vercel.app',
     'https://www.your-domain.vercel.app'
   ]
   ```
4. Redeploy

### Issue: "Frontend assets returning 404"

**Solution:**
1. Verify `vercel.json` has correct rewrites
2. Check file paths in HTML files
3. Ensure case matches (Linux is case-sensitive):
   - ✅ `frontend/admin/index.html`
   - ❌ `frontend/Admin/index.html`

### Issue: "Service Worker not working on PWA"

**Solution:**
1. Ensure PWA is served over HTTPS (Vercel does this)
2. Check `manifest.json` references:
   ```json
   {
     "start_url": "/assistant/",
     "scope": "/assistant/"
   }
   ```
3. Clear browser cache and reinstall PWA

### Issue: "Long-running requests timeout"

Vercel serverless timeout: 60 seconds

**Solution:**
1. Optimize database queries
2. Add indexes to large tables
3. Implement pagination
4. Cache results

---

## Performance Optimization

### Enable Caching

**File: `vercel.json`**

Already configured. Vercel automatically caches:
- Static files: 365 days
- HTML: No cache (revalidated every request)
- API responses: Depends on headers

### Add Cache Headers

In `backend/routes/authRoutes.js` or relevant routes:

```javascript
res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
```

### Monitor Performance

1. In Vercel dashboard → **Analytics**
2. View:
   - Time to First Byte (TTFB)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

---

## Cost Optimization

### Vercel Pricing

- **Hobby plan** (Free): $0
  - 100 GB bandwidth/month
  - 12 serverless function builds/month
  - Great for testing/demo

- **Pro plan**: $20/month per user
  - Unlimited bandwidth
  - Unlimited builds
  - Team collaboration

- **Edge Network**: Only pay for usage (cheap for APIs)

### Reduce Database Costs

- Use free tier: PlanetScale Free ($0), Azure Free, AWS Free
- Optimize queries
- Add indexes
- Archive old data

---

## Security Checklist

- [ ] Change default admin credentials
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS (automatic via Vercel)
- [ ] Add rate limiting to API
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Regular database backups
- [ ] Monitor access logs
- [ ] Update dependencies: `npm audit`

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Set up database
3. ✅ Create Vercel project
4. ✅ Add environment variables
5. ✅ Test API endpoints
6. ✅ Configure frontend URLs
7. ✅ Set custom domain
8. ✅ Monitor performance

---

## Support

- Vercel docs: https://vercel.com/docs
- Next.js (if migrating): https://nextjs.org
- GitHub Actions for CI/CD: https://github.com/features/actions

---

**Last Updated:** November 24, 2025

Deployment Status: ✅ Ready for Vercel
