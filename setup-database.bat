@echo off
setlocal
echo ================================================
echo   MySQL Database Setup for Attendance System
echo ================================================
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
        echo ❌ ERROR: MySQL not found in PATH or common directories.
        echo Please install MySQL or add it to your PATH.
        pause
        exit /b 1
    )
)

echo Found MySQL: %MYSQL%
echo.

REM Ask for password
set /p DB_PASSWORD="Enter MySQL root password: "

echo.
echo Step 1: Creating database...
%MYSQL% -u root -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS attendance_system;"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Failed to create database. Check your password.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating tables...
%MYSQL% -u root -p%DB_PASSWORD% attendance_system < database\schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Failed to create tables.
    pause
    exit /b 1
)

echo.
echo Step 3: Loading sample data...
%MYSQL% -u root -p%DB_PASSWORD% attendance_system < database\seed.sql
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Failed to load sample data.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ SUCCESS! Database setup complete.
echo ================================================
echo.
echo Next steps:
echo 1. Edit backend\.env and set your MySQL password
echo 2. Run: cd backend
echo 3. Run: node generate-hash.js
echo 4. Update database\seed.sql with the hashes (optional)
echo.
pause
