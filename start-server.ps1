# Script para reiniciar o servidor Next.js
Write-Host "Parando processos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Mudando para o diretório do projeto..." -ForegroundColor Cyan
Set-Location "c:\Nova pasta\frontend-premium-limpo"

Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
npm run dev
