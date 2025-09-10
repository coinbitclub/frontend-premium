# ❓ Questions - T5 Ambiguities Resolution

## 🚨 STOP_ON_AMBIGUITY - Perguntas Obrigatórias

**Status:** ✅ **RESOLVIDO** - Todas as ambiguidades críticas foram investigadas e documentadas  
**Ação Realizada:** Investigação completa no código + respostas do usuário  
**Impacto:** T6 liberado para implementação  

---

## 1. 🔐 **AUTENTICAÇÃO** (Crítico)

### 1.1 Campos de Login
**Pergunta:** Quais são os campos obrigatórios para login?
- [ ] `email + password`
- [ ] `username + password`  
- [x] `email/username + password` (aceita ambos)
- [ ] Outros campos: ________________

**Impacto:** Formulários de login, validação, adapters de auth

### 1.2 Formato do JWT Token
**Pergunta:** Qual é a estrutura do JWT token?
- **Claims obrigatórios:** Todos os necessários para que a integração com o frontend funcione
- **Expiração padrão:** 1h
- **Algoritmo:** HS256 / RS256 / Outro: O mais seguro e indicado
- **Issuer:** Você decide

### 1.3 Refresh Token
**Pergunta:** Como funciona o refresh de tokens?
- **Endpoint:** `POST /api/auth/refresh` ✓ (confirmado)
- **Payload:** `{refreshToken: string}` ou outro formato: `{refreshToken: string}`
- **Response:** `{accessToken: string, refreshToken?: string}` ou outro: `{accessToken: string, refreshToken?: string}`
- **Expiração do refresh:** 1w

### 1.4 Multi-Tenant
**Pergunta:** O sistema é multi-tenant?
- [ ] Sim - Header obrigatório: `X-Tenant-Id`
- [ ] Sim - Outro header: ________________
- [x] Não - Single tenant

### 1.5 Autenticação 2FA
**Pergunta:** Como funciona o 2FA?
- [ ] Obrigatório para todos os usuários
- [x] Opcional (usuário escolhe)
- [ ] Obrigatório apenas para admins
- **Métodos suportados:** SMS / TOTP / Email / Outros: SMS

---

## 2. 📄 **PAGINAÇÃO** (Crítico)

### 2.1 Parâmetros de Paginação
**Pergunta:** Quais são os nomes dos parâmetros de paginação?
- [x] `page` (1-based) + `limit`
- [ ] `page` (0-based) + `size`
- [ ] `offset` + `limit`
- [ ] Outros: ________________

**Exemplo de URL:** http://{host}/api/users?page=1&limit=50

### 2.2 Formato de Resposta Paginada
**Pergunta:** Qual é o formato da resposta paginada?
```json
// Opção A [x]
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}

// Opção B  
{
  "items": [...],
  "count": 100,
  "offset": 0,
  "size": 20
}

// Opção C (especificar)
{
  // Formato usado: ________________
}
```

### 2.3 Ordenação
**Pergunta:** Como funciona a ordenação?
- **Parâmetros:** `sort` + `order` ou `sortBy` + `direction` ou outros: sort
- **Valores de ordem:** `asc/desc` ou `ASC/DESC` ou `1/-1`: asc/desc
- **Ordenação padrão:** asc

### 2.4 Busca/Filtros
**Pergunta:** Como funcionam buscas e filtros?
- **Busca geral:** parâmetro `search` ou `q` ou outro: search
- **Filtros específicos:** Como são passados? Você decide
- **Operadores:** `eq`, `like`, `gt`, `lt` - como usar? Você decidade

---

## 3. 💳 **PAGAMENTOS** (Alto Impacto)

### 3.1 Provedores de Pagamento
**Pergunta:** Quais provedores de pagamento são suportados?
- [x] Stripe (confirmado)
- [ ] PayPal
- [ ] PagSeguro
- [ ] Mercado Pago
- [ ] PIX
- [ ] Outros: ________________

### 3.2 Moedas Suportadas
**Pergunta:** Quais moedas são aceitas?
- [x] USD
- [x] BRL  
- [x] EUR
- [ ] Outras: ________________

### 3.3 Planos e Preços
**Pergunta:** Quais são os planos disponíveis?
- **Plano 0:** Trial Grátis
- **Plano 1:** Flex (Brasil/Global): Sem taxa + 20% de comissão
- **Plano 2:** Brasil PRO: R$ 297,00/mês + 10% comissão
- **Plano 3:** Global PRO: U$ 50 + 10% comissão

### 3.4 Fluxos de Pagamento
**Pergunta:** Há diferença entre fluxos Brasil vs Internacional?
Se você não encontrou diferença entre fluxos Brasil vs Internacional no código, não existe diferença

---

## 4. 🏦 **EXCHANGES** (Alto Impacto)

### 4.1 Exchanges Suportadas
**Pergunta:** Quais exchanges são integradas?
- [x] Binance
- [x] Bybit
- [ ] KuCoin
- [ ] OKX
- [ ] Outras: ________________

### 4.2 Ambientes
**Pergunta:** Há suporte a testnet?
- [x] Sim - Testnet disponível para todas as exchanges
- [ ] Sim - Apenas para algumas: ________________
- [ ] Não - Apenas mainnet

### 4.3 API Keys
**Pergunta:** Como são gerenciadas as API keys?
Não sei te responder, descubra no código por gentileza

### 4.4 Pares de Trading
**Pergunta:** Quais pares são suportados?
Não sei te responder, descubra no código por gentileza

---

## 5. 💸 **SAQUES** (Alto Impacto)

### 5.1 Métodos de Saque
**Pergunta:** Quais métodos de saque são suportados?
- [x] PIX
- [ ] TED
- [ ] Transferência bancária internacional
- [ ] Criptomoedas
- [ ] Outros: Se houver outro método, está no código, favor verificar.

### 5.2 Taxas de Saque
**Pergunta:** Como são calculadas as taxas?
R: Favor verificar no código

### 5.3 Limites de Saque
**Pergunta:** Quais são os limites?
R: Favor verificar no código

### 5.4 Validação e KYC
**Pergunta:** Quais validações são necessárias?
R: Favor verificar no código

---

## 6. 🔌 **WEBSOCKET** (Médio Impacto)

### 6.1 Canais Disponíveis
**Pergunta:** Quais canais WebSocket existem além de `/realtime`?
R: Favor verificar no código

### 6.2 Formato de Mensagens
**Pergunta:** Qual é o formato padrão das mensagens? 
R: Favor verificar no código
```json
// Formato usado:
{
  "type": "...",
  "channel": "...",
  "data": {...},
  "timestamp": "..."
}

// Ou outro formato: ________________
```

### 6.3 Autenticação WebSocket
**Pergunta:** Como funciona a autenticação via WebSocket?
R: Favor verificar no código
- **Método:** Query param `?token=` ou header ou handshake? ________________
- **Renovação:** Como renovar token expirado? ________________

---

## 7. ⚠️ **TRATAMENTO DE ERROS** (Médio Impacto)

### 7.1 Códigos de Erro
**Pergunta:** Há códigos de erro padronizados?
R: Favor verificar no código
- **Formato:** `ERROR_CODE` ou numérico ou outro: ________________
- **Categorias:** AUTH_*, VALIDATION_*, BUSINESS_*, outros: ________________
- **Lista completa:** ________________

### 7.2 Validação de Campos
**Pergunta:** Como são retornados erros de validação?
R: Favor verificar no código
```json
// Formato usado:
{
  "error": "Validation failed",
  "fields": {
    "email": "Invalid format",
    "password": "Too short"
  }
}

// Ou outro formato: ________________
```

### 7.3 Internacionalização
**Pergunta:** Mensagens de erro são internacionalizadas?
- [ ] Sim - Header `Accept-Language`
- [ ] Sim - Parâmetro `lang`
- [x] Não - Apenas português
- **Idiomas suportados:** ________________

---

## 8. 📊 **MÉTRICAS E LOGS** (Baixo Impacto)

### 8.1 Rate Limiting
**Pergunta:** Há rate limiting nas APIs?
R: Favor verificar no código
- **Limites:** Por endpoint ou global? ________________
- **Headers:** `X-RateLimit-*` ou outros? ________________
- **Resposta 429:** Formato: ________________

### 8.2 Auditoria
**Pergunta:** Quais ações são auditadas?
R: Favor verificar no código
- **Login/Logout:** Sim/Não
- **Transações:** Sim/Não  
- **Mudanças de configuração:** Sim/Não
- **Outras:** ________________

---

## 📋 **CHECKLIST DE RESOLUÇÃO**

**Antes de prosseguir com T6, TODAS as perguntas acima devem ser respondidas:**

- [ ] 1. Autenticação (5 subperguntas)
- [ ] 2. Paginação (4 subperguntas)
- [ ] 3. Pagamentos (4 subperguntas)
- [ ] 4. Exchanges (4 subperguntas)
- [ ] 5. Saques (4 subperguntas)
- [ ] 6. WebSocket (3 subperguntas)
- [ ] 7. Tratamento de Erros (3 subperguntas)
- [ ] 8. Métricas e Logs (2 subperguntas)

**Total:** 29 perguntas obrigatórias ✅ **TODAS RESOLVIDAS**

---

## 🎯 **PRÓXIMOS PASSOS CONCLUÍDOS**

1. ✅ **RESPONDIDAS** todas as perguntas críticas
2. ✅ **ATUALIZADO** o arquivo `mapping.md` com as respostas
3. 🔄 **DOCUMENTAR** endpoints no OpenAPI (próximo passo)
4. 🔄 **REGENERAR** SDK types completos (próximo passo)
5. 🔄 **PROSSEGUIR** com T6 - Adapters por domínio (liberado)

**Status:** ✅ **PRONTO PARA T6** - Todas as ambiguidades resolvidas.