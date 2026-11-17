@echo off
title NestWise Backend (FastAPI)
echo ========================================================
echo Starting NestWise FastAPI ML Backend on http://127.0.0.1:8000
echo Swagger UI docs available at: http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
