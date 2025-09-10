@echo off
echo Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul
echo.
echo Starting development server...
cd /d "c:\Nova pasta\frontend-premium-limpo"
npm run dev
pause
