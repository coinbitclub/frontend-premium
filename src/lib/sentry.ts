// Placeholder para Sentry - removido dependência não instalada
export function initSentry() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  
  // TODO: Instalar @sentry/browser se necessário
  console.log('Sentry initialization skipped - package not installed');
}
