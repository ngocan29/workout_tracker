@echo off
echo Opening port 5000 for Workout Tracker API...

:: Check if running as administrator
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Please run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /B 1
)

:: Add firewall rule for port 5000
netsh advfirewall firewall add rule name="Workout Tracker API" dir=in action=allow protocol=TCP localport=5000

echo.
echo Port 5000 opened successfully!
echo.
echo Your server will be accessible at:
echo - Local: http://localhost:5000
echo - Network: http://192.168.1.124:5000
echo.
echo To test from another device:
echo 1. Make sure both devices are on the same network
echo 2. Start the server: npm start
echo 3. Access: http://192.168.1.124:5000
echo.
pause