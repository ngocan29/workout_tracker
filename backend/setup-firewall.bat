@echo off
echo Setting up Windows Firewall for Workout Tracker Server...
echo.
echo This script needs to run as Administrator to configure firewall rules.
echo Right-click this file and select "Run as administrator"
echo.

:: Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo Adding firewall rules for ports 5000 and 5001...
netsh advfirewall firewall add rule name="Workout Tracker Port 5000" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="Workout Tracker Port 5001" dir=in action=allow protocol=TCP localport=5001

echo.
echo Firewall rules added successfully!
echo You can now run start-test-server.bat to start the server.
echo.
pause