# 🗄️ MySQL Monolithic Database Setup Guide

**⚠️ CRITICAL**: Your project's `.env` file location issue explained and fixed.

## 🔍 Your Project's .env Configuration

### Current Setup

Your code has this pattern:

**File: `backend/server.js` (Line 4)**
```javascript
require('dotenv').config();  // ← Reads from backend/ folder
```

**File: `backend/config/database.js` (Line 2)**
```javascript
require('dotenv').config();  // ← Reads from backend/ folder
```

### What This Means

✅ `require('dotenv').config()` with **NO PATH ARGUMENT**  
→ Looks for `.env` in **current working directory**

When you run from backend:
```bash
cd backend
node server.js   # Reads backend/.env ✅
```

When Vercel runs it:
```bash
node api/index.js   # Reads root/.env (or uses env variables)
```

---

## 🎯 For Local MySQL Monolithic Setup

### File Structure to Create

```
backend/
├── .env                    ⚠️ CREATE THIS FILE
├── server.js               (already loads from .env)
├── config/
│   └── database.js         (already loads from .env)
├── package.json
└── (other files)
```

### Step 1: Create `backend/.env`

```bash
cd c:\Users\PCM\Downloads\asist-web-main\asist-web-main\backend
```

Create file: `backend/.env`

```env
# ===== DATABASE =====
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=attendance_system
DB_PORT=3306

# ===== SERVER =====
NODE_ENV=development
PORT=5000

# ===== JWT =====
JWT_SECRET=local-development-secret-key
JWT_EXPIRY=7d

# ===== URLS =====
FRONTEND_URL=http://localhost:5000
API_URL=http://localhost:5000/api

# ===== OPTIONAL =====
LOG_LEVEL=info
GPS_RADIUS_METERS=30
SESSION_TIMEOUT=3600000
```

**IMPORTANT**: Never commit this file! Should be in `.gitignore` ✅

### Step 2: Create Local MySQL Database

```bash
# Open MySQL CLI
mysql -u root -p

# Run this SQL
CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;
EXIT;
```

### Step 3: Import Schema & Migrations

```bash
cd c:\Users\PCM\Downloads\asist-web-main\asist-web-main

# Run migration script
migrate-database.bat
```

When prompted, enter password: `root`

Or manually:
```bash
mysql -u root -proot attendance_system < database/schema.sql
mysql -u root -proot attendance_system < database/migrations/001_update_sessions_table.sql
mysql -u root -proot attendance_system < database/migrations/002_add_recurring_sessions.sql
mysql -u root -proot attendance_system < database/migrations/003_create_audit_log_table.sql
mysql -u root -proot attendance_system < database/migrations/004_add_notes_to_attendance.sql
```

### Step 4: Start Application

```bash
cd backend
npm install
npm start
```

**Expected Output**:
```
✅ Database connected successfully
✅ Server running on port 5000 (HTTP)
📱 ASSISTANT PWA: http://localhost:5000/assistant/
👨‍💼 ADMIN DASHBOARD: http://localhost:5000/admin/
```

### Step 5: Test

Open browser:
- Admin: `http://localhost:5000/admin/`
- Assistant: `http://localhost:5000/assistant/`
- API: `http://localhost:5000/api/health`

Login with:
- Email: `admin@example.com`
- Password: `admin123`

---

## ✅ Complete Local Setup Checklist

- [ ] MySQL running
- [ ] Created `backend/.env` with all variables
- [ ] Database `attendance_system` created
- [ ] All migrations imported
- [ ] `.env` added to `.gitignore`
- [ ] Ran `npm install` in backend
- [ ] `npm start` works without errors
- [ ] Can access http://localhost:5000
- [ ] Can login successfully
- [ ] API endpoint http://localhost:5000/api/health responds

---

## ⚠️ .env LOCATION ERROR PREVENTION

### ❌ Common Mistakes

```bash
# WRONG - .env in root
c:\Users\PCM\Downloads\asist-web-main\asist-web-main\.env

# WRONG - doesn't exist
c:\Users\PCM\Downloads\asist-web-main\asist-web-main\backend\ (no .env)

# WRONG - running from wrong directory
cd c:\Users\PCM\Downloads\asist-web-main\asist-web-main
npm start  # Reads root .env, not backend/.env!
```

### ✅ Correct Way

```bash
# CORRECT - .env in backend
c:\Users\PCM\Downloads\asist-web-main\asist-web-main\backend\.env

# CORRECT - run from backend directory
cd c:\Users\PCM\Downloads\asist-web-main\asist-web-main\backend
npm start  # Reads backend/.env ✅
```

---

## 🔧 Troubleshooting

### Issue: "ENOENT: no such file or directory, open '.env'"

**Cause**: `.env` file doesn't exist in backend folder

**Solution**:
```bash
cd backend
type nul > .env           # Create empty .env
# Edit .env with your config
```

### Issue: "Cannot connect to database"

**Cause**: `.env` variables not being read

**Solution**:
1. Verify `.env` is in `backend/` folder (not root)
2. Verify running from backend:
   ```bash
   cd backend
   npm start
   ```
3. Check `.env` format (no spaces around `=`):
   ```env
   DB_HOST=localhost  ✅ Correct
   DB_HOST = localhost  ❌ Wrong (spaces)
   ```

### Issue: "Port 5000 already in use"

**Solution**: Update `backend/.env`:
```env
PORT=5001
```

### Issue: Database connection fails but .env exists

**Solution**:
1. Test MySQL connection:
   ```bash
   mysql -u root -proot -h localhost attendance_system
   ```
2. Verify credentials in `.env` match MySQL
3. Check MySQL is running

---

## 📊 .env Configuration Reference

| Variable | Local Value | Production Value | Purpose |
|----------|-------------|------------------|---------|
| `DB_HOST` | `localhost` | cloud-host.com | Database server |
| `DB_USER` | `root` | app-user | MySQL username |
| `DB_PASSWORD` | `root` | strong-password | MySQL password |
| `DB_NAME` | `attendance_system` | `attendance_system` | Database name |
| `DB_PORT` | `3306` | `3306` | MySQL port |
| `NODE_ENV` | `development` | `production` | Environment type |
| `PORT` | `5000` | `3000` | Server port |
| `JWT_SECRET` | can-be-simple | must-be-strong | JWT signing key |

---

## 🚀 Full Setup Command Sequence

### Copy-Paste Ready (Windows PowerShell)

```powershell
# Step 1: Navigate to project
cd c:\Users\PCM\Downloads\asist-web-main\asist-web-main

# Step 2: Create MySQL database
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS attendance_system;"

# Step 3: Import schema
migrate-database.bat
# (Enter password when prompted: root)

# Step 4: Create backend/.env
cd backend
@"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=attendance_system
DB_PORT=3306
NODE_ENV=development
PORT=5000
JWT_SECRET=local-dev-secret
FRONTEND_URL=http://localhost:5000
API_URL=http://localhost:5000/api
LOG_LEVEL=info
"@ | Out-File -Encoding UTF8 .env

# Step 5: Install and start
npm install
npm start
```

Copy above commands into PowerShell and run.

---

## 📝 Files to Create/Update

### New File: `backend/.env`
Location: `backend/.env` (NOT root!)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=attendance_system
DB_PORT=3306
NODE_ENV=development
PORT=5000
JWT_SECRET=dev-secret
FRONTEND_URL=http://localhost:5000
API_URL=http://localhost:5000/api
```

### Update: `.gitignore`
Add this line:
```
backend/.env
```

Ensure it's NOT committed to Git! ✅

---

## 🎯 MySQL Monolithic Architecture

```
Your Local Machine
│
├── MySQL Server (localhost:3306)
│   └── attendance_system database
│
├── Node.js Backend (localhost:5000)
│   ├── Reads from backend/.env
│   ├── Connects to MySQL
│   └── Serves API
│
├── Frontend (served from backend)
│   ├── /admin/
│   └── /assistant/
│
└── Single Monolithic Database
```

**All data in ONE local MySQL instance** ✅

---

## ⚠️ Before Deploying to Vercel

When you move to Vercel later:

1. **Do NOT** include `.env` files in GitHub
2. **Use** Vercel environment variables dashboard
3. **Create** separate `.env` for production (or use root `.env`)
4. **Modify** code to read from root (if needed)

For now, focus on local setup! 

---

**Status**: Ready for Local MySQL Monolithic Setup
**Created**: November 24, 2025

