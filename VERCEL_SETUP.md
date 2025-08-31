# 🚀 Configuração Vercel - Frontend Premium

## 📋 Checklist de Deploy

### 1. Criar Projeto no Vercel
- [ ] Acessar https://vercel.com/dashboard
- [ ] Clicar em "Add New" → "Project"
- [ ] Selecionar repositório: `coinbitclub/frontend-premium`
- [ ] Configurar branch de produção: `master`

### 2. Configurações do Projeto

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 18.x
```

### 3. Variáveis de Ambiente (Environment Variables)

Adicionar as seguintes variáveis no painel do Vercel:

```env
# Ambiente
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# URLs da API
NEXT_PUBLIC_API_URL=https://api.coinbitclub.com
NEXT_PUBLIC_WS_URL=wss://ws.coinbitclub.com

# Configurações de Trading
NEXT_PUBLIC_TRADING_ENABLED=true
NEXT_PUBLIC_DEMO_MODE=false

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# Configurações de Segurança
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
JWT_SECRET=your_super_secret_jwt_key

# Configurações de Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@coinbitclub.com
SMTP_PASS=your_email_password

# Banco de Dados
DATABASE_URL=postgresql://user:password@host:port/database

# Redis (Cache)
REDIS_URL=redis://user:password@host:port

# Webhook URLs
WEBHOOK_SECRET=your_webhook_secret
```

### 4. Configurações de Build

O projeto já está configurado com:
- ✅ `next.config.mjs` otimizado
- ✅ `vercel.json` configurado
- ✅ Scripts de build no `package.json`

### 5. Branch Strategy

```
Production Branch: master
Preview Branches: develop, feature/*
```

### 6. Custom Domains (Opcional)

Configurar domínios personalizados:
- `admin.coinbitclub.com` (para área administrativa)
- `app.coinbitclub.com` (para aplicação principal)

### 7. Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodejs": "18.x"
}
```

### 8. Deploy Commands

```bash
# Deploy automático via Git
git push origin master

# Deploy manual via CLI
npx vercel --prod

# Deploy preview
npx vercel
```

### 9. Performance Monitoring

- [ ] Configurar Web Vitals
- [ ] Configurar Error Tracking
- [ ] Configurar Analytics
- [ ] Configurar Speed Insights

### 10. Security Headers

Já configurado no `vercel.json`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

---

## 🔧 Troubleshooting

### Build Errors Comuns:

1. **Module not found**: Verificar imports relativos
2. **Environment variables**: Verificar se todas as variáveis estão configuradas
3. **TypeScript errors**: Verificar tipos e interfaces
4. **Memory issues**: Aumentar limite de memória no Vercel

### Links Úteis:
- Dashboard: https://vercel.com/coinbitclub
- Documentação: https://vercel.com/docs
- CLI: https://vercel.com/cli
