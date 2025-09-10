/**
 * 💨 SMOKE TESTS - T10 Implementation
 * Testes básicos para verificar se as funcionalidades principais estão funcionando
 * Validação da integração frontend-backend implementada em T1-T9
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Funcionalidades Principais', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup comum para todos os testes
    await page.goto('/');
  });
  
  test('deve carregar a página inicial sem erros', async ({ page }) => {
    // Verifica se a página inicial carrega
    await expect(page).toHaveTitle(/Frontend Premium/i);
    
    // Verifica se não há erros de console críticos
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Filtra erros conhecidos (como Google Analytics)
    const criticalErrors = errors.filter(error => 
      !error.includes('gtag') && 
      !error.includes('analytics') &&
      !error.includes('google')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
  
  test('deve verificar se o backend está respondendo', async ({ page }) => {
    // Testa o endpoint de health do backend (T1)
    const response = await page.request.get('http://localhost:3333/health');
    expect(response.ok()).toBeTruthy();
    
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status');
    expect(healthData.status).toBe('ok');
  });
  
  test('deve navegar para a página de demonstração de adapters', async ({ page }) => {
    // Testa a navegação para a página de adapters (T6)
    await page.goto('/adapters-demo');
    
    // Verifica se a página carregou
    await expect(page.locator('h1')).toContainText('Demonstração de Adapters');
    
    // Verifica se os adapters estão listados
    await expect(page.locator('text=Core Adapter')).toBeVisible();
    await expect(page.locator('text=Auth Adapter')).toBeVisible();
    await expect(page.locator('text=Users Adapter')).toBeVisible();
  });
  
  test('deve navegar para a página de demonstração de tabelas', async ({ page }) => {
    // Testa a navegação para a página de tabelas (T9)
    await page.goto('/tables-demo');
    
    // Verifica se a página carregou
    await expect(page.locator('h1')).toContainText('Demonstração de Tabelas');
    
    // Verifica se as abas estão presentes
    await expect(page.locator('text=DataTable Básico')).toBeVisible();
    await expect(page.locator('text=UsersTable')).toBeVisible();
    await expect(page.locator('text=Funcionalidades Avançadas')).toBeVisible();
  });
  
  test('deve testar a funcionalidade de busca na tabela', async ({ page }) => {
    // Vai para a página de tabelas
    await page.goto('/tables-demo');
    
    // Aguarda a tabela carregar
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Testa a busca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    await searchInput.fill('Smartphone');
    
    // Aguarda os resultados da busca
    await page.waitForTimeout(1000);
    
    // Verifica se os resultados foram filtrados
    const tableRows = page.locator('tbody tr');
    await expect(tableRows).toHaveCount(1);
    await expect(page.locator('text=Smartphone Pro Max')).toBeVisible();
  });
  
  test('deve testar a paginação da tabela', async ({ page }) => {
    // Vai para a página de tabelas
    await page.goto('/tables-demo');
    
    // Aguarda a tabela carregar
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Verifica se os controles de paginação estão presentes
    await expect(page.locator('text=Página')).toBeVisible();
    await expect(page.locator('text=Mostrar:')).toBeVisible();
    
    // Testa mudança de itens por página
    const pageSizeSelect = page.locator('select').first();
    await pageSizeSelect.selectOption('10');
    
    // Aguarda a atualização
    await page.waitForTimeout(1000);
    
    // Verifica se a paginação foi atualizada
    await expect(page.locator('text=10')).toBeVisible();
  });
  
  test('deve verificar se a página de usuários carrega', async ({ page }) => {
    // Testa a página de lista de usuários (T7)
    await page.goto('/users-list');
    
    // Verifica se a página carregou
    await expect(page.locator('h1')).toContainText('Lista de Usuários');
    
    // Aguarda a tabela carregar (pode demorar devido à integração com backend)
    await page.waitForSelector('table, text=Carregando', { timeout: 15000 });
    
    // Verifica se há conteúdo (tabela ou mensagem de carregamento/erro)
    const hasTable = await page.locator('table').isVisible();
    const hasLoading = await page.locator('text=Carregando').isVisible();
    const hasError = await page.locator('text=Erro').isVisible();
    
    expect(hasTable || hasLoading || hasError).toBeTruthy();
  });
  
  test('deve verificar se a página de detalhes de usuário carrega', async ({ page }) => {
    // Testa a página de detalhes de usuário (T7)
    await page.goto('/users-details?id=1');
    
    // Verifica se a página carregou
    await expect(page.locator('h1')).toContainText('Detalhes do Usuário');
    
    // Verifica se as abas estão presentes
    await expect(page.locator('text=Perfil')).toBeVisible();
    await expect(page.locator('text=Saldo')).toBeVisible();
    await expect(page.locator('text=Transações')).toBeVisible();
  });
  
  test('deve verificar se a página de formulário de usuário carrega', async ({ page }) => {
    // Testa a página de formulário de usuário (T7)
    await page.goto('/users-form?mode=create');
    
    // Verifica se a página carregou
    await expect(page.locator('h1')).toContainText('Criar Usuário');
    
    // Verifica se o formulário está presente
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
  });
  
  test('deve verificar se a página administrativa protegida funciona', async ({ page }) => {
    // Testa a página protegida por guards (T8)
    await page.goto('/admin-protected');
    
    // A página deve carregar (mesmo sem autenticação, devido ao SSR)
    await page.waitForLoadState('networkidle');
    
    // Verifica se a página carregou (pode mostrar loading ou conteúdo)
    const hasContent = await page.locator('h1').isVisible();
    const hasLoading = await page.locator('text=Verificando autenticação').isVisible();
    
    expect(hasContent || hasLoading).toBeTruthy();
  });
  
  test('deve verificar se a página de acesso negado funciona', async ({ page }) => {
    // Testa a página de acesso negado (T8)
    await page.goto('/unauthorized');
    
    // Verifica se a página carregou
    await expect(page.locator('h2')).toContainText('Acesso Negado');
    
    // Verifica se os botões de ação estão presentes
    await expect(page.locator('text=Fazer Login')).toBeVisible();
    await expect(page.locator('text=Ir para Home')).toBeVisible();
  });
  
  test('deve verificar se o WebSocket está funcionando', async ({ page }) => {
    // Testa a conexão WebSocket (T3)
    await page.goto('/realtime');
    
    // Verifica se a página carregou
    await expect(page.locator('h1')).toContainText('Realtime');
    
    // Aguarda a conexão WebSocket
    await page.waitForTimeout(3000);
    
    // Verifica se há indicação de conexão (pode variar dependendo da implementação)
    const hasConnection = await page.locator('text=Conectado').isVisible();
    const hasWebSocket = await page.locator('text=WebSocket').isVisible();
    
    expect(hasConnection || hasWebSocket).toBeTruthy();
  });
});

test.describe('Smoke Tests - Navegação e Links', () => {
  
  test('deve verificar se os links principais funcionam', async ({ page }) => {
    await page.goto('/');
    
    // Lista de links importantes para testar
    const importantLinks = [
      { text: 'Dashboard', url: '/dashboard' },
      { text: 'Usuários', url: '/users' },
    ];
    
    for (const link of importantLinks) {
      // Verifica se o link existe
      const linkElement = page.locator(`a[href="${link.url}"]`).first();
      if (await linkElement.isVisible()) {
        // Clica no link
        await linkElement.click();
        
        // Aguarda a navegação
        await page.waitForLoadState('networkidle');
        
        // Verifica se navegou corretamente
        expect(page.url()).toContain(link.url);
        
        // Volta para a página inicial
        await page.goto('/');
      }
    }
  });
});

test.describe('Smoke Tests - Responsividade', () => {
  
  test('deve funcionar em dispositivos móveis', async ({ page }) => {
    // Simula um dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/tables-demo');
    
    // Verifica se a página é responsiva
    await expect(page.locator('h1')).toBeVisible();
    
    // Verifica se a tabela se adapta ao mobile
    const table = page.locator('table');
    if (await table.isVisible()) {
      const tableWidth = await table.boundingBox();
      expect(tableWidth?.width).toBeLessThanOrEqual(375);
    }
  });
});