# 🗺️ API Mapping & Domain Analysis - T5

## Resumo Executivo

**Total de Endpoints Identificados:** 150+  
**Domínios Mapeados:** 20  
**Status Geral:** Pronto para T6 (Adapters)  
**Cobertura OpenAPI:** 5% (apenas schemas básicos)  

## 📊 Distribuição por Domínio

| Domínio | Endpoints | Status | Prioridade | Observações |
|---------|-----------|--------|------------|-------------|
| **Core** | 6 | ✅ OK | Alta | Health, status, rotas básicas |
| **Trading** | 12 | ✅ OK | Alta | Sistema principal de trading |
| **Financial** | 12 | ✅ OK | Alta | Transações e balanços |
| **Auth** | 7 | ✅ OK | Alta | Login email/username, JWT 1h, refresh 1w |
| **Users** | 7 | ✅ OK | Alta | CRUD completo de usuários |
| **Dashboard** | 15 | ✅ OK | Alta | Dashboards operacionais |
| **Affiliate** | 15 | ✅ OK | Média | Sistema de afiliados |
| **Payments** | 6 | ✅ OK | Alta | Stripe, USD/BRL/EUR, 4 planos |
| **Webhooks** | 6 | ✅ OK | Alta | Integração externa |
| **Market** | 3 | ✅ OK | Alta | Dados de mercado |
| **Signals** | 4 | ✅ OK | Alta | Sinais de trading |
| **Notifications** | 3 | ✅ OK | Média | Sistema de notificações |
| **Withdrawals** | 9 | ⚠️ AMBIGUIDADE | Alta | **PERGUNTA:** Taxas e limites? |
| **Exchanges** | 4 | ⚠️ AMBIGUIDADE | Alta | **PERGUNTA:** Quais exchanges? |
| **AI** | 5 | ✅ OK | Média | Análises de IA |
| **Admin** | 2 | ✅ OK | Alta | Painel administrativo |
| **Monitoring** | 3 | ✅ OK | Média | Monitoramento do sistema |
| **Coupons** | 3 | ✅ OK | Baixa | Sistema de cupons |
| **Demo** | 3 | ✅ OK | Baixa | Dados de demonstração |
| **Misc** | 15 | ✅ OK | Baixa | Utilitários diversos |

## 🚨 Ambiguidades Identificadas (STOP_ON_AMBIGUITY)

### 1. **Autenticação** ✅
**Resolvido:** 
- Campos de login: `email/username + password` (aceita ambos)
- Refresh token: `POST /api/auth/refresh` com payload `{refreshToken: string}`, response `{accessToken: string, refreshToken?: string}`, expiração 1w
- Multi-tenant: Não (single tenant)
- 2FA: Opcional (usuário escolhe), método SMS
- JWT: Expiração 1h, algoritmo seguro (HS256/RS256)

**Endpoints Liberados:**
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/enterprise/auth/2fa/setup`

### 2. **Pagamentos** ✅
**Resolvido:**
- Provedores: Apenas Stripe
- Moedas: USD, BRL, EUR
- Planos: Trial Grátis, Flex (20% comissão), Brasil PRO (R$ 297/mês + 10%), Global PRO ($50 + 10%)
- Fluxos: Sem diferença entre Brasil/Internacional (verificar no código se necessário)

**Endpoints Liberados:**
- `POST /api/stripe/recharge`
- `POST /api/subscription/brazil/create-link`
- `POST /api/subscription/foreign/create-link`

### 3. **Saques (Withdrawals)** ✅
**Resolvido:**
- Métodos: PIX (principal), outros métodos via código
- Taxas: BRL R$ 10,00 fixo, USD $ 2,00 fixo
- Limites: Sem mínimo desde que saldo > taxa, validação automática
- Validação: Função `validate_withdrawal_with_fee()`, sem KYC obrigatório
- Processamento: Aprovação manual via `approved_by`, registro completo

**Endpoints Liberados:**
- `POST /api/withdrawal-fees/calculate`
- `POST /api/withdrawal-fees/validate`
- `POST /api/withdrawal-fees/process`

### 4. **Exchanges** ✅
**Resolvido:**
- Exchanges: Binance, Bybit (principais), suporte via CCXT
- Ambientes: Testnet e Mainnet, auto-detecção por API keys
- API Keys: Tabela `user_api_keys`, campos `api_key`+`secret_key`, criptografia
- Pares: BTCUSDT, ETHUSDT (principais), futures e spot
- Validação: Status `is_valid`, `validation_status`, `last_checked`

**Endpoints Liberados:**
- `POST /api/exchanges/connect-user`
- `GET /api/exchanges/balances`
- `GET /api/trade/connection/:userId/:exchange/:environment`

### 5. **Paginação** ✅
**Resolvido:**
- Parâmetros: `page` (1-based) + `limit`
- Resposta: `{data: [], total: number, page: number, limit: number}`
- Ordenação: parâmetro `sort`, valores `asc/desc`, padrão `asc`
- Busca: parâmetro `search`
- URL exemplo: `http://host/api/users?page=1&limit=50&sort=asc&search=termo`

**Endpoints Liberados:**
- `GET /api/users` (paginação)
- `GET /api/dashboard/signals` (paginação)
- `GET /api/affiliate/commissions` (paginação)

## ✅ Domínios Prontos para T6

### **Core** (6 endpoints)
**Status:** ✅ Pronto  
**Padrão:** REST simples  
**Autenticação:** Não requerida  

**Endpoints:**
- `GET /` - Root API
- `GET /health` - Health check
- `GET /status` - System status
- `GET /api/status` - API status
- `GET /api/routes` - List routes
- `GET /metrics` - Prometheus metrics

### **Trading** (12 endpoints)
**Status:** ✅ Pronto  
**Padrão:** REST + WebSocket  
**Autenticação:** Bearer token  

**Endpoints Principais:**
- `POST /api/enterprise/trading/signal` - Processar sinal
- `POST /api/enterprise/trading/execute` - Executar ordem
- `GET /api/enterprise/trading/positions` - Posições ativas
- `DELETE /api/enterprise/trading/positions/:id` - Fechar posição
- `GET /api/enterprise/trading/analysis` - Análise de mercado

**Padrões Identificados:**
- Prefixo: `/api/enterprise/trading/`
- Autenticação: Bearer JWT
- Formato: JSON request/response
- WebSocket: Atualizações em tempo real

### **Financial** (12 endpoints)
**Status:** ✅ Pronto  
**Padrão:** REST transacional  
**Autenticação:** Bearer token  

**Endpoints Principais:**
- `GET /api/enterprise/financial/balance` - Saldo do usuário
- `GET /api/enterprise/financial/transactions` - Transações
- `POST /api/enterprise/financial/deposit` - Depósito
- `POST /api/enterprise/financial/withdraw` - Saque

### **Users** (7 endpoints)
**Status:** ✅ Pronto  
**Padrão:** CRUD completo  
**Autenticação:** Bearer token + Admin  

**Endpoints:**
- `GET /api/users` - Listar (paginado)
- `POST /api/users` - Criar
- `GET /api/users/:id` - Buscar por ID
- `PUT /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Desativar
- `POST /api/users/:id/promote` - Promover
- `GET /api/user/:userId/balances` - Saldos do usuário

### **Dashboard** (15 endpoints)
**Status:** ✅ Pronto  
**Padrão:** APIs de dados + SSE  
**Autenticação:** Bearer token  

**Categorias:**
- **Realtime:** `/api/dashboard/realtime`
- **Dados:** `/api/dashboard/{signals,orders,users,balances}`
- **Métricas:** `/api/dashboard/{metrics,system,performance-metrics}`
- **Logs:** `/api/dashboard/admin-logs`
- **Busca:** `/api/dashboard/search`
- **Stream:** `/api/dashboard/stream`

## 📋 Padrões Identificados

### **Autenticação**
```javascript
// Headers padrão
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### **Respostas de Erro**
```javascript
{
  "error": "Mensagem de erro",
  "code": "ERROR_CODE", // opcional
  "timestamp": "2025-01-09T23:45:00.000Z"
}
```

### **Respostas de Sucesso**
```javascript
// Dados simples
{
  "data": {...},
  "success": true
}

// Listas paginadas (CONFIRMAR formato)
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### **WebSocket (Realtime)**
```javascript
// Conexão
ws://localhost:3333/realtime

// Mensagens
{
  "type": "subscribe",
  "channel": "trading.signals"
}
```

## 🎯 Próximos Passos (T6)

### **Domínios Prioritários para Adapters**
1. **Core** - Adapter básico (health, status)
2. **Trading** - Adapter principal (sinais, posições)
3. **Financial** - Adapter financeiro (saldos, transações)
4. **Users** - Adapter de usuários (CRUD)
5. **Dashboard** - Adapter de dashboards (métricas)
6. **Auth** - Adapter de autenticação (login, refresh, 2FA)
7. **Payments** - Adapter de pagamentos (Stripe, planos)
8. **Affiliate** - Adapter de afiliados (comissões, links)

### **Estrutura de Adapters Sugerida**
```
src/lib/api/adapters/
├── core.adapter.ts
├── trading.adapter.ts
├── financial.adapter.ts
├── users.adapter.ts
├── dashboard.adapter.ts
├── auth.adapter.ts      # Após resolver ambiguidades
├── payments.adapter.ts  # Após resolver ambiguidades
└── index.ts
```

## ❓ Perguntas Pendentes para Resolução

**Antes de prosseguir com T6, as seguintes ambiguidades DEVEM ser resolvidas:**

1. **Auth:** Campos de login e formato de tokens?
2. **Payments:** Provedores além do Stripe?
3. **Withdrawals:** Taxas e limites por método?
4. **Exchanges:** Lista de exchanges suportadas?
5. **Paginação:** Nomes de parâmetros e formato de resposta?
6. **Multi-tenant:** Há header `X-Tenant-Id` ou similar?
7. **Refresh Token:** Endpoint e formato do refresh?
8. **WebSocket:** Canais disponíveis além de `/realtime`?

## 📊 Estatísticas Finais

- **Total de Endpoints:** 150+
- **Domínios Mapeados:** 20
- **Prontos para T6:** 5 domínios (Core, Trading, Financial, Users, Dashboard)
- **Aguardando Resolução:** 4 domínios (Auth, Payments, Withdrawals, Exchanges)
- **Cobertura OpenAPI Atual:** 5% (apenas schemas básicos)
- **Cobertura Necessária T11:** 100%

**Status:** ✅ **PRONTO** - Todas as ambiguidades críticas resolvidas. Pronto para T6 - Adapters.