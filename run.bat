@echo off
REM Coy Discover - one-click launcher. Usage: run.bat [dev|prod|test]   (default: dev)
REM   test = build, start server, run API + browser (Playwright) tests, stop server
cd /d "%~dp0"
title Coy Discover

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js 18+ is required. Install from https://nodejs.org
  pause & exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install || (echo [ERROR] npm install failed & pause & exit /b 1)
)

if /i "%1"=="test" (
  call npm run build || (echo [ERROR] build failed & pause & exit /b 1)
  call npx playwright install chromium
  start "coy-test-server" /min cmd /c "npm run start"
  timeout /t 8 /nobreak >nul
  call npm test
  call npm run test:e2e
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%p /F >nul 2>nul
  pause & exit /b 0
)

if /i "%1"=="prod" (
  echo Building production bundle...
  call npm run build || (echo [ERROR] build failed & pause & exit /b 1)
  start "" http://localhost:3000
  call npm run start
) else (
  start "" http://localhost:3000
  call npm run dev
)
