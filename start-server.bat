@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo  Personal Tools - local server
echo ========================================
echo.
echo  Home:
echo    http://127.0.0.1:8080/
echo.
echo  iPhone Safari (same WiFi), try:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=*" %%b in ("%%a") do echo    http://%%b:8080/
)
echo.
echo  Keep this window open. Ctrl+C to stop.
echo ========================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  where py >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] python not found. Install Python or add it to PATH.
    echo.
    pause
    exit /b 1
  )
  start "" "http://127.0.0.1:8080/"
  py -m http.server 8080
) else (
  start "" "http://127.0.0.1:8080/"
  python -m http.server 8080
)

if errorlevel 1 (
  echo.
  echo [ERROR] failed to start server.
  echo.
  pause
)
