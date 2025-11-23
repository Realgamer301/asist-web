@echo off
setlocal
echo =====================================================
echo   Database Migration Tool
echo =====================================================
echo.

REM Find MySQL
set MYSQL=mysql
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
        set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    ) else if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
        set MYSQL="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
    ) else (
        echo ❌ ERROR: MySQL not found.
        pause
        exit /b 1
    )
)

REM Ask for password
set /p DB_PASSWORD="Enter MySQL root password: "

echo.
echo Step 1: Creating backup...
if not exist "database\backups" mkdir "database\backups"
for /f %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set datetime=%%i
set backup_file=database\backups\backup_%datetime%.sql

mysqldump -u root -p%DB_PASSWORD% attendance_system > "%backup_file%" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Warning: Backup failed (mysqldump not found or error). Proceeding anyway...
) else (
    echo ✅ Backup created at: %backup_file%
)

echo.
echo Step 2: Running Migration 001 (Update Sessions)...
%MYSQL% -u root -p%DB_PASSWORD% attendance_system < "database\migrations\001_update_sessions_table.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Migration 001 might have failed or already applied.
) else (
    echo ✅ Migration 001 applied.
)

echo.
echo Step 3: Running Migration 002 (Recurring Sessions)...
%MYSQL% -u root -p%DB_PASSWORD% attendance_system < "database\migrations\002_add_recurring_sessions.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Migration 002 might have failed or already applied.
) else (
    echo ✅ Migration 002 applied.
)

echo.
echo Step 4: Running Migration 003 (Create Audit Log Table)...
%MYSQL% -u root -p%DB_PASSWORD% attendance_system < "database\migrations\003_create_audit_log_table.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Migration 003 might have failed or already applied.
) else (
    echo ✅ Migration 003 applied.
)

echo.
echo ========================================
echo   ✅ Migration Process Complete!
echo ========================================
echo.
pause
