/**
 * 🧹 GLOBAL TEARDOWN - T10 Implementation
 * Teardown global para testes E2E do Playwright
 * Limpeza após execução dos testes
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E Test Teardown...');
  
  try {
    // Cleanup test data if needed
    console.log('🗑️ Cleaning up test data...');
    
    // You can add cleanup logic here
    // For example, remove test users, clean database, etc.
    
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;