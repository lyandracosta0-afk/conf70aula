# Confeitaria 7.0 - Sistema de Gestão para Confeitarias

Sistema completo de gestão para confeitarias com autenticação Supabase, verificação de assinatura Stripe e interface moderna.

## 🚀 Funcionalidades

- **Landing Page**: Apresentação do produto com CTA para assinatura
- **Autenticação**: Login/cadastro com Supabase Auth
- **Verificação de Assinatura**: Integração com Stripe para validar assinaturas ativas
- **Dashboard Completo**: Gestão de pedidos, clientes e produtos
- **Responsivo**: Interface otimizada para desktop e mobile

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Conta no Stripe
- Conta no Netlify (para deploy)

## 🛠️ Configuração Local

### 1. Clone e instale dependências

```bash
npm install
```

### 2. Configure variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

As variáveis já estão configuradas no `.env.example` com os valores corretos.

### 3. Execute o projeto

```bash
npm run dev
```

## 🚀 Deploy

### 1. Deploy do Frontend (Netlify)

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente no Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_FUNCTIONS_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

3. O deploy será automático com as configurações do `netlify.toml`

### 2. Deploy da Edge Function (Supabase)

1. Instale o Supabase CLI:
```bash
npm install -g supabase
```

2. Faça login no Supabase:
```bash
supabase login
```

3. Configure a variável de ambiente no Supabase:
   - Acesse o painel do Supabase
   - Vá em Settings > Edge Functions
   - Adicione a variável `STRIPE_SECRET_KEY` com sua chave secreta do Stripe

4. Deploy da função:
```bash
supabase functions deploy check-subscription --project-ref stasbepnjxxyifjhprwu
```

## 🔧 Configuração do Banco de Dados

Execute as migrações no Supabase para criar as tabelas necessárias:

```sql
-- As migrações estão em supabase/migrations/
-- Elas serão executadas automaticamente se você usar o Supabase CLI
-- Ou você pode executá-las manualmente no SQL Editor do Supabase
```

## 💳 Configuração do Stripe

1. **Produto já configurado**: 
   - Price ID: `price_1RuOijB1cuFGKX9IiXufwpJU`
   - Payment Link: `https://buy.stripe.com/test_dRmeVcfyGeKJ6np0lEefC03`

2. **Chaves necessárias**:
   - Publishable Key (frontend): `pk_test_51Rt8pCB1cuFGKX9I3b7x7HykxRsCoY42gCUxENl9EwYyTTXq2356MsHRjo8IejZXfch5q8RFzpRwzDPNvasifLOr00PJG0yQAA`
   - Secret Key (backend): Configure no Supabase Edge Functions

## 🔐 Segurança

- ✅ Todas as chaves públicas usam prefixo `VITE_`
- ✅ Nenhuma chave secreta no frontend
- ✅ Chave secreta do Stripe apenas no backend (Edge Function)
- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas de segurança configuradas

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth)
├── lib/               # Configurações (Supabase)
├── pages/             # Páginas da aplicação
└── main.tsx           # Ponto de entrada

supabase/
├── functions/         # Edge Functions
└── migrations/        # Migrações do banco
```

## 🎯 Fluxo de Funcionamento

1. **Landing**: Usuário vê apresentação e clica em "Começar Agora"
2. **Stripe**: Usuário é direcionado para checkout do Stripe
3. **Cadastro**: Após pagamento, usuário se cadastra na aplicação
4. **Verificação**: Sistema verifica assinatura ativa via Edge Function
5. **Dashboard**: Acesso liberado para gestão completa da confeitaria

## 🆘 Troubleshooting

### Erro de autenticação
- Verifique se as variáveis do Supabase estão corretas
- Confirme que o usuário está cadastrado no Supabase Auth

### Erro de assinatura
- Verifique se a Edge Function foi deployada
- Confirme que `STRIPE_SECRET_KEY` está configurada no Supabase
- Verifique se o email do usuário tem assinatura ativa no Stripe

### Erro de deploy
- Confirme que todas as variáveis estão configuradas no Netlify
- Verifique se o `netlify.toml` está na raiz do projeto