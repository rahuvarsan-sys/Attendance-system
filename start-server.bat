@echo off
setlocal
cd /d "%~dp0"
echo Starting Attendance Management System...
if not exist package.json (
  echo package.json not found in %cd%
  pause
  exit /b 1
)
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js and try again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Dependencies not installed. Running npm install...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

curl.exe -fsS http://localhost:3000/ >nul 2>&1
if not errorlevel 1 (
  echo The server is already running. Opening the application...
  start "" http://localhost:3000/
  exit /b 0
)

echo Starting the server...
start "Attendance Management System Server" /min cmd /c "node server.js > server.log 2>&1"
timeout /t 2 /nobreak >nul
curl.exe -fsS http://localhost:3000/ >nul 2>&1
if errorlevel 1 (
  echo The server did not start. Check server.log for details.
  type server.log
  pause
  exit /b 1
)
start "" http://localhost:3000/
echo Attendance Management System is running at http://localhost:3000/
endlocal
