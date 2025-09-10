/**
 * 🌍 GLOBAL SETUP - T10 Implementation
 * Setup global para testes E2E do Playwright
 * Prepara ambiente e dados de teste
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E Test Setup...');
  
  // Wait for servers to be ready
  console.log('⏳ Waiting for servers to be ready...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Check frontend server
    console.log('🔍 Checking frontend server (http://localhost:3003)...');
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });
    console.log('✅ Frontend server is ready');
    
    // Check backend server
    console.log('🔍 Checking backend server (http://localhost:3333)...');
    const healthResponse = await page.request.get('http://localhost:3333/health');
    if (healthResponse.ok()) {
      console.log('✅ Backend server is ready');
    } else {
      throw new Error(`Backend health check failed: ${healthResponse.status()}`);
    }
    
    // Setup test data if needed
    console.log('📊 Setting up test data...');
    
    // You can add test data setup here
    // For example, create test users, seed database, etc.
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;