@echo off
title NestWise Launcher
echo ========================================================
echo Launching NestWise Full-Stack Application...
echo ========================================================
start "NestWise Backend" cmd /c "%~dp0run_backend.bat"
start "NestWise Frontend" cmd /c "%~dp0run_frontend.bat"
echo Both servers are starting up!
echo Backend:  http://127.0.0.1:8000 (Swagger: http://127.0.0.1:8000/docs)
echo Frontend: http://localhost:5173
pause
