# Script para limpar páginas desnecessárias da área do usuário
# Mantém apenas as 5 páginas aprovadas: dashboard, operations, performance, plans, settings

$userPagesPath = "c:\Nova pasta\frontend-premium-limpo\pages\user"

# Páginas aprovadas que devem ser mantidas
$approvedPages = @(
    "dashboard.tsx",
    "operations.tsx", 
    "performance.tsx",
    "plans.tsx",
    "settings.tsx"
)

# Listar todos os arquivos na pasta user
$allFiles = Get-ChildItem -Path $userPagesPath -Name "*.tsx"

Write-Host "=== LIMPEZA DA ÁREA DO USUÁRIO ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Páginas APROVADAS (serão mantidas):" -ForegroundColor Green
foreach($page in $approvedPages) {
    Write-Host "  ✓ $page" -ForegroundColor Green
}

Write-Host ""
Write-Host "Páginas que serão REMOVIDAS:" -ForegroundColor Red

$filesToRemove = @()
foreach($file in $allFiles) {
    if($file -notin $approvedPages) {
        Write-Host "  ✗ $file" -ForegroundColor Red
        $filesToRemove += $file
    }
}

Write-Host ""
Write-Host "Total de arquivos a remover: $($filesToRemove.Count)" -ForegroundColor Yellow

# Comentar a linha abaixo para executar a remoção real
# foreach($file in $filesToRemove) {
#     Remove-Item "$userPagesPath\$file" -Force
#     Write-Host "Removido: $file" -ForegroundColor Red
# }

Write-Host ""
Write-Host "Para executar a limpeza, descomente as linhas de remoção no script." -ForegroundColor Cyan
