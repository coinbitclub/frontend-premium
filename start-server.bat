@echo off
echo Parando processos Node.js existentes...
taskkill /f /im node.exe 2>nul

echo Iniciando servidor de desenvolvimento...
cd /d "c:\Nova pasta\frontend-premium-limpo"
npm run dev
pause
