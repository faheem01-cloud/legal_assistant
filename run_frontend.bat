@echo off
title LegalMind AI - Frontend Server
echo ========================================================
echo   Starting LegalMind AI Frontend (React + Vite)
echo ========================================================
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo Starting Vite development server...
call npm run dev
pause
