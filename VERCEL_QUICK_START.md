# ⚡ Vercel Quick Start (5 Minutes)

**Fastest way to get your app on Vercel**

## Prerequisites
- GitHub account
- Vercel account (free)
- Cloud database (PlanetScale recommended)

## Step 1: Database (2 minutes)

### Create PlanetScale Database
1. Go to https://planetscale.com
2. Sign up / Login
3. Click **Create database**
4. Name: `attendance_system`
5. Region: Closest to you
6. Click **Create**

### Get Connection String
1. Click **Connect**
2. Choose **Node.js**
3. Copy connection string
4. Extract from format `mysql://user:password@host:3306/dbname`:
   - `DB_HOST`: the `host` part
   - `DB_USER`: the `user` part
   - `DB_PASSWORD`: the `password` part
   - `DB_NAME`: `attendance_system`

### Import Schema
1. In PlanetScale, click on your database
2. Go to **Branches** → **main**
3. Look for **Import** option
4. Upload files in this order:
   - `database/schema.sql`
   - `database/migrations/001_update_sessions_table.sql`
   - `database/migrations/002_add_recurring_sessions.sql`
   - `database/migrations/003_create_audit_log_table.sql`
   - `database/migrations/004_add_notes_to_attendance.sql`

**Done with database!** ✅

---

## Step 2: GitHub (1 minute)

1. Go to https://github.com/new
2. Create new repository: `assistant-attendance-system`
3. Choose **Private**
4. Click **Create repository**

### Push Code
```bash
# In project root
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/assistant-attendance-system.git
git branch -M main
git push -u origin main
```

**Done with GitHub!** ✅

---

## Step 3: Vercel (2 minutes)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Search for `assistant-attendance-system`
5. Click **Import**
6. Keep defaults:
   - Framework: Other
   - Build: `npm run build`
7. Click **Deploy**

Wait 2-3 minutes for deployment...

---

## Step 4: Environment Variables

After deployment completes:

1. Click **Settings** → **Environment Variables**
2. Add these variables:

```
DB_HOST=<from-planetscale>
DB_USER=<from-planetscale>
DB_PASSWORD=<from-planetscale>
DB_NAME=attendance_system
DB_PORT=3306
JWT_SECRET=your-super-secret-key-here-make-it-long
NODE_ENV=production
FRONTEND_URL=https://YOUR-PROJECT.vercel.app
API_URL=https://YOUR-PROJECT.vercel.app/api
```

3. For each, select: ✅ Production ✅ Preview ✅ Development
4. Click **Save**

---

## Step 5: Redeploy

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **Redeploy**
4. Wait for new build

---

## Test It! ✅

Your site should be live at: `https://YOUR-PROJECT.vercel.app`

### Test API
```bash
curl https://YOUR-PROJECT.vercel.app/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Attendance System API is running",
  "timestamp": "2025-11-24T10:00:00.000Z"
}
```

### Test Frontend
- Admin: https://YOUR-PROJECT.vercel.app/admin/
- Assistant: https://YOUR-PROJECT.vercel.app/assistant/

### Test Login
- Email: `admin@example.com`
- Password: `admin123`

---

## 🎉 Done!

Your app is now live on Vercel!

### Next Steps (Optional)

1. **Add Custom Domain**
   - Settings → Domains
   - Add your domain
   - Update DNS records
   - Wait 24 hours for DNS

2. **Enable Monitoring**
   - Settings → Integrations
   - Connect Slack for alerts

3. **Update Credentials**
   - Change admin password in app
   - Delete test accounts

---

## Troubleshooting

### "Cannot connect to database"
- Check all DB environment variables
- Verify PlanetScale firewall allows all IPs
- Test locally first

### "API returns 404"
- Check that routes don't include `/api/` prefix
- Routes prefixed in `api/index.js`

### "CORS errors"
- Update `FRONTEND_URL` in env vars
- Check origin in `api/index.js`

---

## For Detailed Guide
See **[VERCEL_SETUP.md](VERCEL_SETUP.md)**

---

**Deployment Time**: ~5 minutes
**Cost**: $0 (on free tier)
**Date**: November 24, 2025
