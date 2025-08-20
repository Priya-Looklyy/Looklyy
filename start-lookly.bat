@echo off
echo Starting Lookly App...
echo.

echo Starting Backend Server...
start "Lookly Backend" cmd /k "cd /d C:\Users\Priya\OneDrive\Desktop\Lookly\server && npm run dev"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Lookly Frontend" cmd /k "cd /d C:\Users\Priya\OneDrive\Desktop\Lookly\client && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open the app in your browser...
pause > nul
start http://localhost:3000
