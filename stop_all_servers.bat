@echo off
title Aegis Intel - Server Stopper
cd /d "%~dp0"

echo ========================================================
echo Stopping Aegis Intel Servers (Ports 8080, 5173, and 8000)...
echo ========================================================

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 " ^| findstr "LISTENING"') do (
    echo Stopping Backend process (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    echo Stopping Frontend process (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    echo Stopping AI Microservice process (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo All Aegis Intel servers stopped.
