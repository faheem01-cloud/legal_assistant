@echo off
title LegalMind AI - Backend Server
echo ========================================================
echo   Starting LegalMind AI Backend (FastAPI + ChromaDB)
echo ========================================================
cd /d "%~dp0"
if not exist "backend\venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found at backend\venv!
    echo Please run: python -m venv backend\venv
    echo and install requirements: backend\venv\Scripts\pip install -r backend\requirements.txt
    pause
    exit /b 1
)

echo Activating backend virtual environment...
set PYTHONPATH=%~dp0
backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload --reload-dir backend
pause
