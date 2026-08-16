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

python -m http.server 8080
if errorlevel 1 (
  echo.
  echo [ERROR] python not found. Try: py -m http.server 8080
  echo.
  pause
)
