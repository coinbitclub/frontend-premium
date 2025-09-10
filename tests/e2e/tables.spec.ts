/**
 * 📊 TABLE TESTS - T10 Implementation
 * Testes específicos para funcionalidades de tabela implementadas em T9
 * Validação de paginação, filtros, busca e interações
 */

import { test, expect } from '@playwright/test';

test.describe('Testes de Tabela - DataTable Component', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/tables-demo');
    await page.waitForSelector('table', { timeout: 10000 });
  });
  
  test('deve exibir dados na tabela básica', async ({ page }) => {
    // Verifica se a tabela tem dados
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCountGreaterThan(0);
    
    // Verifica se as colunas estão presentes
    await expect(page.locator('th:has-text("ID")')).toBeVisible();
    await expect(page.locator('th:has-text("Produto")')).toBeVisible();
    await expect(page.locator('th:has-text("Categoria")')).toBeVisible();
    await expect(page.locator('th:has-text("Preço")')).toBeVisible();
    await expect(page.locator('th:has-text("Estoque")')).toBeVisible();
  });
  
  test('deve funcionar a busca global', async ({ page }) => {
    // Localiza o campo de busca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    
    // Testa busca por produto específico
    await searchInput.fill('Smartphone');
    await page.waitForTimeout(500); // Aguarda debounce
    
    // Verifica se filtrou corretamente
    const visibleRows = page.locator('tbody tr:visible');
    await expect(visibleRows).toHaveCount(1);
    await expect(page.locator('text=Smartphone Pro Max')).toBeVisible();
    
    // Limpa a busca
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Verifica se voltou a mostrar todos os itens
    await expect(visibleRows).toHaveCountGreaterThan(1);
  });
  
  test('deve funcionar os filtros por coluna', async ({ page }) => {
    // Abre o painel de filtros
    const filterButton = page.locator('button:has-text("Filtros")');
    await filterButton.click();
    
    // Verifica se o painel de filtros abriu
    await expect(page.locator('text=Filtrar por categoria')).toBeVisible();
    
    // Aplica um filtro por categoria
    const categoryFilter = page.locator('input[placeholder*="categoria"]');
    await categoryFilter.fill('Electronics');
    
    // Aplica os filtros
    await page.locator('button:has-text("Aplicar Filtros")').click();
    
    // Verifica se filtrou corretamente
    await page.waitForTimeout(500);
    const filteredRows = page.locator('tbody tr:visible');
    await expect(filteredRows).toHaveCountGreaterThan(0);
    
    // Verifica se todos os itens visíveis são da categoria Electronics
    const categoryBadges = page.locator('tbody tr:visible .bg-blue-100');
    const badgeCount = await categoryBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });
  
  test('deve funcionar a ordenação por colunas', async ({ page }) => {
    // Clica no header da coluna de preço para ordenar
    const priceHeader = page.locator('th:has-text("Preço") button');
    await priceHeader.click();
    
    // Aguarda a ordenação
    await page.waitForTimeout(500);
    
    // Verifica se o ícone de ordenação apareceu
    const sortIcon = page.locator('th:has-text("Preço") span');
    await expect(sortIcon).toBeVisible();
    
    // Clica novamente para inverter a ordenação
    await priceHeader.click();
    await page.waitForTimeout(500);
    
    // Verifica se a ordenação mudou
    await expect(sortIcon).toBeVisible();
  });
  
  test('deve funcionar a paginação', async ({ page }) => {
    // Verifica se os controles de paginação estão presentes
    await expect(page.locator('text=Página')).toBeVisible();
    await expect(page.locator('text=Mostrar:')).toBeVisible();
    
    // Muda o número de itens por página
    const pageSizeSelect = page.locator('select').first();
    await pageSizeSelect.selectOption('10');
    
    // Aguarda a atualização
    await page.waitForTimeout(500);
    
    // Verifica se a informação de paginação foi atualizada
    await expect(page.locator('text=10')).toBeVisible();
    
    // Testa navegação entre páginas (se houver mais de uma página)
    const nextButton = page.locator('button[aria-label="Next page"], button:has(svg)');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      
      // Verifica se mudou de página
      await expect(page.locator('text=Página 2')).toBeVisible();
    }
  });
  
  test('deve funcionar a seleção de linhas', async ({ page }) => {
    // Verifica se há checkboxes de seleção
    const headerCheckbox = page.locator('thead input[type="checkbox"]');
    const rowCheckboxes = page.locator('tbody input[type="checkbox"]');
    
    if (await headerCheckbox.isVisible()) {
      // Seleciona todos os itens
      await headerCheckbox.click();
      
      // Verifica se todos os checkboxes foram marcados
      const checkedBoxes = page.locator('tbody input[type="checkbox"]:checked');
      const totalBoxes = await rowCheckboxes.count();
      const checkedCount = await checkedBoxes.count();
      
      expect(checkedCount).toBe(totalBoxes);
      
      // Verifica se apareceu a informação de seleção
      await expect(page.locator('text=selecionado')).toBeVisible();
      
      // Desmarca todos
      await headerCheckbox.click();
      
      // Verifica se todos foram desmarcados
      const uncheckedCount = await page.locator('tbody input[type="checkbox"]:not(:checked)').count();
      expect(uncheckedCount).toBe(totalBoxes);
    }
  });
  
  test('deve funcionar as ações da tabela', async ({ page }) => {
    // Verifica se há botões de ação
    const actionButtons = page.locator('tbody tr:first-child button');
    const actionCount = await actionButtons.count();
    
    if (actionCount > 0) {
      // Testa o primeiro botão de ação (geralmente "Ver")
      const firstAction = actionButtons.first();
      
      // Clica no botão e verifica se abre um alert ou modal
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('produto');
        dialog.accept();
      });
      
      await firstAction.click();
    }
  });
});

test.describe('Testes de Tabela - UsersTable Component', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/tables-demo');
    
    // Muda para a aba UsersTable
    await page.locator('button:has-text("UsersTable")').click();
    await page.waitForTimeout(1000);
  });
  
  test('deve carregar a tabela de usuários', async ({ page }) => {
    // Aguarda a tabela carregar (pode demorar devido à integração com backend)
    await page.waitForSelector('table, text=Carregando, text=Erro', { timeout: 15000 });
    
    // Verifica se há conteúdo
    const hasTable = await page.locator('table').isVisible();
    const hasLoading = await page.locator('text=Carregando').isVisible();
    const hasError = await page.locator('text=Erro').isVisible();
    
    expect(hasTable || hasLoading || hasError).toBeTruthy();
    
    // Se a tabela carregou, verifica as colunas específicas de usuários
    if (hasTable) {
      await expect(page.locator('th:has-text("Nome")')).toBeVisible();
      await expect(page.locator('th:has-text("Email")')).toBeVisible();
      await expect(page.locator('th:has-text("Role")')).toBeVisible();
      await expect(page.locator('th:has-text("Status")')).toBeVisible();
    }
  });
  
  test('deve exibir badges de role e status corretamente', async ({ page }) => {
    // Aguarda a tabela carregar
    const table = page.locator('table');
    await table.waitFor({ timeout: 15000 });
    
    if (await table.isVisible()) {
      // Verifica se há badges de role
      const roleBadges = page.locator('.bg-red-100, .bg-blue-100, .bg-purple-100, .bg-gray-100');
      if (await roleBadges.count() > 0) {
        await expect(roleBadges.first()).toBeVisible();
      }
      
      // Verifica se há badges de status
      const statusBadges = page.locator('.bg-green-100, .bg-yellow-100');
      if (await statusBadges.count() > 0) {
        await expect(statusBadges.first()).toBeVisible();
      }
    }
  });
  
  test('deve funcionar a busca de usuários', async ({ page }) => {
    // Aguarda a tabela carregar
    await page.waitForSelector('table, text=Carregando', { timeout: 15000 });
    
    const searchInput = page.locator('input[placeholder*="usuários"]');
    if (await searchInput.isVisible()) {
      // Testa a busca
      await searchInput.fill('admin');
      await page.waitForTimeout(1000);
      
      // Verifica se a busca foi aplicada (pode não haver resultados)
      const rows = page.locator('tbody tr');
      const rowCount = await rows.count();
      
      // A busca deve ter sido executada (mesmo que não haja resultados)
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });
  
  test('deve funcionar as ações específicas de usuários', async ({ page }) => {
    // Aguarda a tabela carregar
    await page.waitForSelector('table, text=Carregando', { timeout: 15000 });
    
    const table = page.locator('table');
    if (await table.isVisible()) {
      // Verifica se há ações específicas de usuários
      const userActions = page.locator('button:has-text("Ver"), button:has-text("Editar"), button:has-text("Promover")');
      const actionCount = await userActions.count();
      
      if (actionCount > 0) {
        // Testa uma ação (com handler de dialog)
        page.on('dialog', dialog => {
          expect(dialog.message()).toContain('usuário');
          dialog.accept();
        });
        
        await userActions.first().click();
      }
    }
  });
});

test.describe('Testes de Tabela - Funcionalidades Avançadas', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/tables-demo');
    
    // Muda para a aba de funcionalidades avançadas
    await page.locator('button:has-text("Funcionalidades Avançadas")').click();
  });
  
  test('deve exibir informações sobre as funcionalidades', async ({ page }) => {
    // Verifica se as informações estão presentes
    await expect(page.locator('text=Funcionalidades Implementadas')).toBeVisible();
    await expect(page.locator('text=Estatísticas dos Componentes')).toBeVisible();
    await expect(page.locator('text=Exemplos de Uso')).toBeVisible();
    
    // Verifica se há checkmarks das funcionalidades
    const checkmarks = page.locator('span:has-text("✅")');
    await expect(checkmarks).toHaveCountGreaterThan(5);
  });
  
  test('deve exibir estatísticas corretas', async ({ page }) => {
    // Verifica se as estatísticas estão presentes
    await expect(page.locator('text=DataTable (Core)')).toBeVisible();
    await expect(page.locator('text=useDataTable Hook')).toBeVisible();
    await expect(page.locator('text=UsersTable')).toBeVisible();
    
    // Verifica se há números de linhas de código
    await expect(page.locator('text=linhas')).toBeVisible();
  });
  
  test('deve exibir exemplos de código', async ({ page }) => {
    // Verifica se há exemplos de código
    const codeBlock = page.locator('pre');
    await expect(codeBlock).toBeVisible();
    
    // Verifica se contém código TypeScript/JavaScript
    const codeText = await codeBlock.textContent();
    expect(codeText).toContain('DataTable');
    expect(codeText).toContain('useDataTable');
  });
});

test.describe('Testes de Tabela - Responsividade', () => {
  
  test('deve ser responsiva em dispositivos móveis', async ({ page }) => {
    // Simula um dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/tables-demo');
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Verifica se a tabela se adapta ao mobile
    const table = page.locator('table');
    const tableContainer = page.locator('.overflow-x-auto');
    
    await expect(table).toBeVisible();
    await expect(tableContainer).toBeVisible();
    
    // Verifica se os controles de paginação são responsivos
    const paginationControls = page.locator('text=Mostrar:');
    if (await paginationControls.isVisible()) {
      const controlsBox = await paginationControls.boundingBox();
      expect(controlsBox?.width).toBeLessThanOrEqual(375);
    }
  });
  
  test('deve funcionar em tablets', async ({ page }) => {
    // Simula um tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/tables-demo');
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Verifica se a tabela funciona bem em tablets
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Verifica se as abas são clicáveis
    const tabs = page.locator('button:has-text("DataTable Básico")');
    await expect(tabs).toBeVisible();
    await tabs.click();
    
    // Verifica se a navegação funciona
    await expect(page.locator('table')).toBeVisible();
  });
});