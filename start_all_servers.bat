@echo off
title Aegis Intel - Server Launcher
cd /d "%~dp0"

echo ========================================================
echo Aegis Intel - Criminal Network Analysis Server Launcher
echo ========================================================

REM Check AI Microservice Port 8000
netstat -ano | findstr ":8000 " | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] AI Microservice is ALREADY running on http://127.0.0.1:8000
) else (
    echo [INFO] Starting AI Microservice on port 8000...
    start "Aegis Intel AI Microservice" cmd /k "cd /d %~dp0ai-service && %~dp0.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000"
)

REM Check Backend Port 8080
netstat -ano | findstr ":8080 " | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Backend is ALREADY running on http://localhost:8080
) else (
    echo [INFO] Starting Backend on port 8080...
    start "Aegis Intel Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"
)

REM Check Frontend Port 5173
netstat -ano | findstr ":5173 " | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Frontend is ALREADY running on http://localhost:5173
) else (
    echo [INFO] Starting Frontend on port 5173...
    start "Aegis Intel Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
)

echo.
echo ========================================================
echo Servers are up and accessible:
echo   Web Application: http://localhost:5173
echo   REST API:        http://localhost:8080
echo   AI Microservice: http://127.0.0.1:8000/docs
echo ========================================================
echo.
