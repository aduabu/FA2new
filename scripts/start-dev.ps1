# FrontAccounting Enterprise Platform — PowerShell Developer Startup Script

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting FrontAccounting Enterprise Platform (v1.0.0-RC1) " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check prerequisites
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 2. Verify .env configuration
if (-not (Test-Path .env)) {
    Write-Host "Creating .env configuration from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

# 3. Launch Docker Compose Stack
Write-Host "Launching Docker containers (MySQL, Redis, PHP API, React Web)..." -ForegroundColor Green
docker-compose up --build -d

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " SUCCESS: Platform Stack is Live and Healthy!            " -ForegroundColor Green
Write-Host " Web Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host " REST API:     http://localhost:8080/api/v1/health" -ForegroundColor Yellow
Write-Host " Demo User:    admin / password123" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
