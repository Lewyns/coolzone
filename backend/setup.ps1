# CoolZone - Backend Setup Script
# Windows PowerShell

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  CoolZone - Backend Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
python --version

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Navigate to backend directory
Set-Location "C:\Users\user\Downloads\chicken.4r1n-hackatech-2026\backend"

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "SUCCESS: Dependencies installed!" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host ".env file found!" -ForegroundColor Green
} else {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "IMPORTANT: Please edit .env file and add your OpenWeatherMap API Key!" -ForegroundColor Red
    Write-Host "Get free API key from: https://openweathermap.org/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Enter to open .env file in Notepad..." -ForegroundColor Yellow
    Read-Host
    notepad .env
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the backend server, run:" -ForegroundColor Yellow
Write-Host "  python app.py" -ForegroundColor Cyan
Write-Host ""
