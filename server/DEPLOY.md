# Deploy do Backend NestJS

## Render.com (Recomendado)

### 1. Criar conta no Render

- Vai para [render.com](https://render.com)
- Cria uma conta gratuita

### 2. Criar novo Web Service

- Clica em "New +" → "Web Service"
- Conecta o teu repositório GitHub
- Seleciona o repositório `newsdotai`

### 3. Configurar o Deploy

- **Name**: `newsdotai-backend` (ou o nome que quiseres)
- **Root Directory**: `server` (importante!)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### 4. Variáveis de Ambiente

Adiciona estas variáveis no painel do Render:

- `NEWSDATA_API_KEY`: tua chave da NewsData.io
- `PORT`: `3001` (ou deixa vazio, o Render define automaticamente)

### 5. Deploy

- Clica em "Create Web Service"
- Aguarda o deploy (pode demorar alguns minutos)

### 6. URL do Backend

Após o deploy, vais ter uma URL como:
`https://newsdotai-backend.onrender.com`

## Atualizar Frontend

Depois de teres a URL do backend, atualiza o ficheiro `src/config/env.ts`:

```typescript
baseUrl: import.meta.env.DEV
  ? "http://localhost:3001/api"
  : "https://newsdotai-backend.onrender.com/api", // Tua URL do Render
```

## Testar

Testa o backend com:

```bash
curl "https://newsdotai-backend.onrender.com/api/news?q=test"
```

## Alternativas

### Railway

- Similar ao Render
- URL: [railway.app](https://railway.app)

### Heroku

- Mais complexo mas muito estável
- URL: [heroku.com](https://heroku.com)

### Vercel

- Bom para serverless
- URL: [vercel.com](https://vercel.com)
