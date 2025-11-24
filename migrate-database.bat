@echo off
setlocal enabledelayedexpansion
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
        echo ERROR: MySQL not found.
        pause
        exit /b 1
    )
)

REM Ask for password
set /p DB_PASSWORD="Enter MySQL root password: "

echo.
echo Step 1: Creating backup...
if not exist "database\backups" mkdir "database\backups"
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set backup_file=database\backups\backup_!mydate!_!mytime!.sql

mysqldump -u root -p!DB_PASSWORD! attendance_system > "!backup_file!" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Backup failed. Proceeding anyway...
) else (
    echo Backup created at: !backup_file!
)

echo.
echo Step 2: Running Migration 001 (Update Sessions)...
!MYSQL! -u root -p!DB_PASSWORD! attendance_system < "database\migrations\001_update_sessions_table.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Migration 001 might have failed or already applied.
) else (
    echo Migration 001 applied.
)

echo.
echo Step 3: Running Migration 002 (Recurring Sessions)...
!MYSQL! -u root -p!DB_PASSWORD! attendance_system < "database\migrations\002_add_recurring_sessions.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Migration 002 might have failed or already applied.
) else (
    echo Migration 002 applied.
)

echo.
echo Step 4: Running Migration 003 (Create Audit Log Table)...
!MYSQL! -u root -p!DB_PASSWORD! attendance_system < "database\migrations\003_create_audit_log_table.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Migration 003 might have failed or already applied.
) else (
    echo Migration 003 applied.
)

echo.
echo Step 5: Running Migration 004 (Add Notes to Attendance)...
!MYSQL! -u root -p!DB_PASSWORD! attendance_system < "database\migrations\004_add_notes_to_attendance.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Migration 004 might have failed or already applied.
) else (
    echo Migration 004 applied.
)

echo.
echo ========================================
echo   Migration Process Complete!
echo ========================================
echo.
pause
