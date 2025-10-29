# PowerShell script to open port 5000
# Run as Administrator

Write-Host "Opening port 5000 for Workout Tracker API..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Please run PowerShell as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    # Add firewall rule for port 5000
    New-NetFirewallRule -DisplayName "Workout Tracker API" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
    
    Write-Host ""
    Write-Host "Port 5000 opened successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your server will be accessible at:" -ForegroundColor Cyan
    Write-Host "- Local: http://localhost:5000" -ForegroundColor Yellow
    Write-Host "- Network: http://192.168.1.124:5000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To test from another device:" -ForegroundColor Cyan
    Write-Host "1. Make sure both devices are on the same network"
    Write-Host "2. Start the server: npm start"
    Write-Host "3. Access: http://192.168.1.124:5000"
    Write-Host ""
    
} catch {
    Write-Host "Error opening port: $($_.Exception.Message)" -ForegroundColor Red
}

Read-Host "Press Enter to exit"