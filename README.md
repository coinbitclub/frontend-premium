# CoinBitClub Premium Frontend

Este é um projeto [Next.js](https://nextjs.org) para a plataforma de trading CoinBitClub, focado em operações automatizadas e venda de cupons promocionais.

## 🚀 Deploy em Produção

**URL de Produção**: https://coinbitclub-market-36phbrnne-coinbitclubs-projects.vercel.app

## 📋 Guia de Navegação para Desenvolvedores

### 🔧 Como Executar Localmente

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 👤 Área do Usuário

### `/user/dashboard` - Dashboard Principal
**Funções e Integrações Necessárias:**

- **Resumo de Saldo**
  - `GET /api/user/balance` - Saldo atual, saldo em operações, lucro/prejuízo
  - Exibição de gráfico de evolução patrimonial
  - Cards com estatísticas de performance

- **Operações Ativas**
  - `GET /api/user/operations/active` - Lista de operações em andamento
  - Status em tempo real via WebSocket
  - Botões para fechar operações manualmente

- **Histórico Recente**
  - `GET /api/user/operations/recent` - Últimas 10 operações
  - Filtros por data, resultado, par de moedas
  - Paginação para histórico completo

- **Estatísticas de Performance**
  - Taxa de sucesso, drawdown máximo, profit factor
  - Gráficos de distribuição de resultados

### `/user/operations` - Operações de Trading
**Funções e Integrações Necessárias:**

- **Painel de Controle**
  - `POST /api/user/operations/start` - Iniciar operação automática
  - `POST /api/user/operations/stop` - Parar robô
  - `PUT /api/user/operations/{id}/close` - Fechar operação específica

- **Configurações de Robô**
  - `GET/PUT /api/user/robot/settings` - Configurar stop loss, take profit, volume
  - Seleção de pares de moedas disponíveis
  - Configuração de horários de operação

- **Monitoramento em Tempo Real**
  - WebSocket para atualizações de preços
  - Timeline de operações com logs detalhados
  - Indicadores técnicos em tempo real

- **Histórico de Operações**
  - `GET /api/user/operations/history` - Histórico completo paginado
  - Filtros avançados (data, par, resultado, tipo)
  - Exportação para CSV/Excel

### `/user/historico-operacoes` - Histórico Detalhado
**Funções e Integrações Necessárias:**

- **Lista de Operações**
  - `GET /api/user/operations/history` - Histórico paginado
  - Filtros por período, resultado, exchange
  - Ordenação por data, lucro, duração

- **Detalhes de Operação**
  - `GET /api/user/operations/{id}` - Detalhes específicos de uma operação
  - Gráfico de preço durante a operação
  - Logs de decisões do algoritmo

- **Relatórios e Análises**
  - `GET /api/user/reports/performance` - Relatórios de performance
  - Métricas calculadas (Sharpe ratio, máximo drawdown)
  - Comparação com benchmarks

### `/user/settings` - Configurações do Usuário
**Funções e Integrações Necessárias:**

- **Perfil do Usuário**
  - `GET/PUT /api/user/profile` - Dados pessoais, foto, informações de contato
  - Verificação de identidade (KYC)
  - Configurações de localização e idioma

- **Configurações de Segurança**
  - `PUT /api/user/security/password` - Alterar senha
  - `POST /api/user/security/2fa/enable` - Ativar 2FA
  - `GET /api/user/security/sessions` - Gerenciar sessões ativas

- **Configurações de Trading**
  - `GET/PUT /api/user/trading/preferences` - Preferências de risco, notificações
  - Configurar limites de perda diária/mensal
  - Horários preferenciais para operações

- **Integrações de Exchange**
  - `POST /api/user/exchanges/connect` - Conectar APIs de exchanges
  - `GET /api/user/exchanges/status` - Status das conexões
  - Configuração de chaves API (Binance, Bybit, etc.)

---

## 🛡️ Área de Administração

### `/admin/dashboard` - Dashboard Administrativo
**Funções e Integrações Necessárias:**

- **Estatísticas Globais**
  - `GET /api/admin/stats/overview` - Usuários totais, ativos, receita
  - Cards com métricas principais (usuários, receita, cupons)
  - Gráficos de crescimento temporal

- **Status do Sistema**
  - `GET /api/admin/system/status` - Status de integrações (Binance, Bybit, OpenAI, etc.)
  - Monitoramento de APIs externas
  - Alertas de sistema

- **Atividade Recente**
  - `GET /api/admin/activity/recent` - Log de atividades do sistema
  - Novos usuários, operações, erros
  - Filtros por tipo e severidade

- **Solicitações de Usuários**
  - `GET /api/admin/requests` - Lista de solicitações de suporte
  - `POST /api/admin/requests/{id}/reply` - Responder solicitação
  - `PUT /api/admin/requests/{id}/status` - Alterar status (pendente/resolvido)
  - Sistema completo de tickets de suporte

### `/admin/users` - Gerenciamento de Usuários
**Funções e Integrações Necessárias:**

- **Lista de Usuários**
  - `GET /api/admin/users` - Lista paginada de usuários
  - Filtros por status, data de cadastro, atividade
  - Busca por nome, email, ID

- **Detalhes do Usuário**
  - `GET /api/admin/users/{id}` - Perfil completo do usuário
  - Histórico de operações, saldos, atividade
  - Logs de ações e autenticações

- **Ações Administrativas**
  - `PUT /api/admin/users/{id}/status` - Ativar/desativar usuário
  - `POST /api/admin/users/{id}/password-reset` - Resetar senha
  - `PUT /api/admin/users/{id}/balance` - Ajustar saldo manualmente
  - Sistema de notas internas sobre usuários

### `/admin/analytics` - Analytics e Relatórios
**Funções e Integrações Necessárias:**

- **Métricas de Usuários**
  - `GET /api/admin/analytics/users` - Crescimento de usuários, retenção
  - Gráficos de cadastros, ativações, churn
  - Análise de comportamento por coorte

- **Performance de Trading**
  - `GET /api/admin/analytics/trading` - Performance geral da plataforma
  - Taxa de sucesso global, volume operado
  - Análise por par de moedas e exchanges

- **Receitas e Conversão**
  - `GET /api/admin/analytics/revenue` - Análise de receita
  - Conversão de usuários gratuitos para pagos
  - Lifetime value (LTV) dos usuários

### `/admin/financial` - Gestão Financeira
**Funções e Integrações Necessárias:**

- **Resumo Financeiro**
  - `GET /api/admin/financial/summary` - Receitas, despesas, lucro líquido
  - Cards com indicadores principais
  - Gráficos de evolução temporal

- **Gestão de Receitas**
  - `GET /api/admin/financial/revenues` - Lista de receitas (comissões, cupons)
  - Filtros por tipo, período, status
  - Detalhamento por fonte de receita

- **Controle de Despesas**
  - `GET /api/admin/financial/expenses` - Lista de despesas operacionais
  - `POST /api/admin/financial/expenses` - Cadastrar nova despesa
  - Categorização e aprovação de gastos

- **Relatórios Contábeis**
  - `GET /api/admin/financial/reports` - Relatórios para contabilidade
  - Exportação em formatos contábeis
  - Conciliação bancária

### `/admin/coupons` - Gerenciamento de Cupons
**Funções e Integrações Necessárias:**

- **Lista de Cupons**
  - `GET /api/admin/coupons` - Lista todos os cupons (ativos/inativos)
  - Filtros por status, tipo, validade
  - Busca por código ou descrição

- **Criação de Cupons**
  - `POST /api/admin/coupons` - Criar novo cupom promocional
  - Configurar desconto, validade, limite de uso
  - Cupons personalizados ou em lote

- **Gestão de Cupons**
  - `PUT /api/admin/coupons/{id}` - Editar cupom existente
  - `DELETE /api/admin/coupons/{id}` - Desativar cupom
  - `GET /api/admin/coupons/{id}/usage` - Relatório de uso

- **Estatísticas de Cupons**
  - Taxa de conversão por cupom
  - Receita gerada por promoções
  - Análise de efetividade

### `/admin/settings` - Configurações do Sistema
**Funções e Integrações Necessárias:**

- **Configurações de Segurança**
  - `GET/PUT /api/admin/settings/security` - Políticas de senha, 2FA, sessões
  - Configurar timeout de sessão
  - Whitelist de IPs administrativos

- **Configurações da Plataforma**
  - `GET/PUT /api/admin/settings/platform` - Modo manutenção, registros
  - Habilitar/desabilitar funcionalidades
  - Limites operacionais globais

- **Taxas e Comissões**
  - `GET/PUT /api/admin/settings/fees` - Configurar taxas da plataforma
  - Comissões por tipo de operação
  - Estrutura de preços dinâmica

- **Configurações Gerais**
  - Idioma padrão, timezone
  - Configurações de email e notificações
  - Integrações com serviços externos

---

## 🔐 Sistema de Autenticação

### Rotas Públicas
- `/auth/login` - Login de usuários
- `/auth/register` - Cadastro de novos usuários
- `/auth/forgot-password` - Recuperação de senha

### Middleware de Autenticação
- Verificação de JWT tokens
- Redirecionamento baseado em perfil (user/admin)
- Proteção de rotas administrativas

---

## 🌐 APIs Externas Integradas

### Trading
- **Binance API** - Operações e dados de mercado
- **Bybit API** - Operações alternativas
- **WebSocket** - Dados em tempo real

### Inteligência Artificial
- **OpenAI API** - Análise de sentimento e assistência
- **Processamento de linguagem natural** para suporte

### Pagamentos
- **Stripe** - Processamento de pagamentos
- **Sistema de cupons** - Descontos e promoções

### Comunicação
- **Twilio** - SMS e notificações
- **Email Service** - Notificações por email

---

## 📊 Estrutura de Dados Principais

### Usuário
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  profile: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  balance: number;
  createdAt: Date;
  lastLogin: Date;
}
```

### Operação de Trading
```typescript
interface TradingOperation {
  id: string;
  userId: string;
  pair: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  status: 'open' | 'closed' | 'cancelled';
  profit?: number;
  openedAt: Date;
  closedAt?: Date;
}
```

### Cupom Promocional
```typescript
interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usageCount: number;
  status: 'active' | 'inactive' | 'expired';
}
```

### Solicitação de Suporte
```typescript
interface UserRequest {
  id: string;
  userId: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'financial' | 'account' | 'trading' | 'general';
  assignedTo?: string;
  responses: RequestResponse[];
  createdAt: Date;
}
```

---

## 🚀 Deploy e Ambiente

### Desenvolvimento
```bash
npm run dev
```

### Produção
- **Vercel**: Deployment automático via GitHub
- **Environment Variables**: Configuradas no painel Vercel
- **Build**: `npm run build`

### Variáveis de Ambiente Necessárias
```env
NEXT_PUBLIC_APP_NAME=CoinBitClub Premium
NEXT_PUBLIC_APP_VERSION=3.0.0
NEXT_PUBLIC_ENV=production
BINANCE_API_KEY=
BINANCE_SECRET_KEY=
BYBIT_API_KEY=
BYBIT_SECRET_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
DATABASE_URL=
JWT_SECRET=
```

---

## 📞 Suporte e Documentação

Para dúvidas sobre integração, consulte a documentação das APIs ou entre em contato com a equipe de desenvolvimento.

**Última atualização**: Novembro 2025  
**Versão**: 3.0.0
