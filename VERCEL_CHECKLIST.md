# 🚀 Vercel Deployment Checklist

Use this checklist before deploying to Vercel.

## Pre-Deployment Preparation

- [ ] All code committed to GitHub
- [ ] `.env.example` updated with current variables
- [ ] `.gitignore` updated (includes `node_modules`, `.env`, etc.)
- [ ] `package.json` scripts include `build` command
- [ ] No sensitive data in any file (all in `.env.example`)

## GitHub Setup

- [ ] GitHub repository created and public
- [ ] All files pushed to `main` branch
- [ ] `.vercelignore` file present
- [ ] `vercel.json` configuration file present

## Database Preparation

- [ ] Cloud database selected (PlanetScale, Azure, or AWS)
- [ ] Database created with name `attendance_system`
- [ ] Database user created with proper credentials
- [ ] Schema imported (all 5 SQL files)
- [ ] Test data seeded (optional)
- [ ] Can connect from outside network (firewall rules)

## Vercel Project Setup

- [ ] Vercel account created
- [ ] GitHub repository imported to Vercel
- [ ] Project name set to: `assistant-attendance-system`

## Environment Variables (in Vercel)

Add these in **Settings → Environment Variables**:

```
□ DB_HOST              Production / Preview / Development
□ DB_USER              Production / Preview / Development
□ DB_PASSWORD          Production / Preview / Development
□ DB_NAME              Production / Preview / Development (default: attendance_system)
□ DB_PORT              Production / Preview / Development (default: 3306)
□ JWT_SECRET           Production / Preview / Development (strong random string)
□ NODE_ENV             Production: production | Preview/Dev: development
□ FRONTEND_URL         https://your-domain.vercel.app
□ API_URL              https://your-domain.vercel.app/api
□ LOG_LEVEL            info (or debug for troubleshooting)
```

## Deployment

- [ ] Initial deployment completed without errors
- [ ] Build status shows "READY"
- [ ] No runtime errors in logs
- [ ] Can access `/api/health` endpoint

## API Testing

- [ ] `GET /api/health` returns 200 status
- [ ] `POST /api/auth/login` works with test credentials
- [ ] Database queries execute successfully
- [ ] No CORS errors in console

## Frontend Configuration

- [ ] `frontend/shared/js/api.js` updated with correct API_URL
- [ ] All frontend files uploaded to Vercel
- [ ] Admin portal accessible at `/admin/`
- [ ] Assistant app accessible at `/assistant/`
- [ ] Static assets loading (CSS, JS, images)

## SSL/HTTPS

- [ ] HTTPS enabled (automatic via Vercel)
- [ ] All HTTP traffic redirected to HTTPS
- [ ] SSL certificate valid (green padlock)

## Custom Domain (if using)

- [ ] Domain purchased and accessible
- [ ] DNS records updated (or nameservers changed)
- [ ] Domain added in Vercel project settings
- [ ] Domain pointing verified (green checkmark in Vercel)
- [ ] HTTPS working on custom domain

## Monitoring & Alerts

- [ ] Analytics enabled and monitored
- [ ] Error tracking set up (if using Sentry, etc.)
- [ ] Alerts configured for failures
- [ ] Logs accessible and reviewed

## Security Verification

- [ ] Default admin credentials changed (optional for test)
- [ ] JWT_SECRET is strong and unique
- [ ] No hardcoded secrets in code
- [ ] CORS properly configured
- [ ] Database firewall rules appropriate

## Performance Check

- [ ] API response time < 500ms
- [ ] No timeout errors in logs
- [ ] Database queries optimized
- [ ] Static files cached properly

## Post-Deployment

- [ ] Document Vercel deployment URL
- [ ] Document database connection details (securely)
- [ ] Set up regular backups for database
- [ ] Monitor first 24 hours for errors
- [ ] Notify team of deployment

## Rollback Plan

- [ ] Know how to access previous deployments
- [ ] Previous database backups available
- [ ] Can quickly revert via Vercel if needed
- [ ] Have team communication method ready

---

## Common Issues Checklist

If deployment fails:

- [ ] Check build logs for error messages
- [ ] Verify all environment variables set correctly
- [ ] Ensure database is accessible from Vercel IPs
- [ ] Check that all routes are accessible
- [ ] Review Vercel function logs

---

**Status**: ✅ Ready to Deploy to Vercel

Date: November 24, 2025

For detailed instructions, see [VERCEL_SETUP.md](VERCEL_SETUP.md)
