Write-Host "Starting Lookly App..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Priya\OneDrive\Desktop\Lookly\server'; npm run dev" -WindowStyle Normal

Write-Host "Waiting 3 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Priya\OneDrive\Desktop\Lookly\client'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Press Enter to open the app in your browser (or 'n' to skip)"
if ($response -ne 'n') {
    Start-Process "http://localhost:3000"
}
