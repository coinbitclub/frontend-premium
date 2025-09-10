@echo off
echo Limpando cache e reiniciando servidor...
echo.

echo Parando processos Node.js...
taskkill /f /im node.exe 2>nul

echo Limpando cache do Next.js...
cd /d "c:\Nova pasta\frontend-premium-limpo"
rmdir /s /q .next 2>nul
echo Cache limpo!

echo.
echo Iniciando servidor de desenvolvimento...
npm run dev

pause
