# NewsDotAI

Aplicação React moderna para busca e gestão de notícias com backend NestJS proxy. Resolve problemas de CORS e oferece autenticação Firebase, gestão de tópicos pessoais e interface responsiva.

## 📁 Estrutura do Projeto

```
newsdotai/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks (useAuth, useNews, etc.)
│   ├── services/          # Serviços de API
│   ├── config/            # Configuração de ambiente
│   └── types/             # Definições TypeScript
├── server/                # Backend NestJS (Proxy API)
│   ├── src/
│   │   ├── news/          # Módulo de notícias
│   │   └── main.ts        # Ponto de entrada
│   └── package.json
└── package.json           # Frontend package.json
```

## 🛠️ Stack Tecnológica

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Firebase  
**Backend:** NestJS + Axios + CORS  
**Deploy:** GitHub Pages (Frontend) + Render (Backend)

## 🚀 Comandos de Desenvolvimento

### Instalação

```bash
# Instalar tudo (frontend + backend)
npm run install:all

# Ou individualmente
npm install                    # Frontend
cd server && npm install       # Backend
```

### Execução Local

```bash
# Opção 1: Tudo de uma vez (Recomendado)
npm run dev:full

# Opção 2: Separadamente
npm run dev                    # Frontend (porta 5173)
npm run server:dev            # Backend (porta 3001)
```

### Build e Deploy

```bash
# Build
npm run build                 # Frontend
npm run server:build          # Backend

# Deploy
npm run deploy                # GitHub Pages
```

## ⚙️ Configuração de Ambiente

### Frontend (.env)

```env
# Firebase (obrigatório)
VITE_FIREBASE_API_KEY=sua_chave_firebase
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Base URL (opcional)
VITE_BASE=/
```

### Backend (server/.env)

```env
# NewsData.io API Key (obrigatório)
NEWSDATA_API_KEY=sua_chave_do_newsdata.io
```

## 🌐 Endpoints da API

### Backend NestJS (Proxy)

- `GET /` - Health check
- `GET /api/news` - Buscar notícias da NewsData.io

**Parâmetros suportados:**

- `q` - Query de busca
- `language` - Idioma (pt, en, es, etc.)
- `country` - País (pt, us, gb, etc.)
- `category` - Categoria (sports, technology, etc.)
- `page` - Página de resultados

**Exemplos:**

```bash
# Notícias de desporto em Portugal
curl "http://localhost:3001/api/news?country=pt&category=sports"

# Notícias sobre tecnologia
curl "http://localhost:3001/api/news?q=technology&language=en"
```

## 🔐 Configuração Firebase

1. **Criar projeto** no [Firebase Console](https://console.firebase.google.com/)
2. **Ativar serviços:**
   - Authentication (Email/Password)
   - Firestore Database
3. **Configurar regras de segurança** do Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /topics/{topicId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
         match /settings/{settingId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
       match /usernames/{username} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. **Adicionar variáveis** no `.env`

## 🚀 Deploy em Produção

### Frontend (GitHub Pages)

```bash
# Deploy automático
npm run deploy

# URL: https://boalrolo.github.io/newsdotai/
```

### Backend (Render)

1. **Criar conta** no [Render.com](https://render.com)
2. **Criar Web Service:**
   - Connect GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
3. **Adicionar variável de ambiente:**
   - `NEWSDATA_API_KEY`: tua chave da NewsData.io
4. **Deploy automático** após push para main

### Atualizar Frontend para Produção

Após deploy do backend, atualizar `src/config/env.ts`:

```typescript
baseUrl: import.meta.env.DEV
  ? "http://localhost:3001/api"
  : "https://newsdotai-backend.onrender.com/api", // Tua URL do Render
```

## 📱 Funcionalidades

- **Autenticação:** Login/Registo com Firebase
- **Gestão de Tópicos:** Adicionar, editar, eliminar tópicos pessoais
- **Busca de Notícias:** API NewsData.io via proxy NestJS
- **Tema:** Toggle claro/escuro persistente
- **Responsivo:** Interface adaptável a todos os dispositivos
- **Persistência:** Dados guardados no Firestore

## 🔧 Troubleshooting

### Porta 3001 ocupada

```bash
lsof -ti :3001 | xargs kill -9
```

### Erro de CORS

- Backend já resolve automaticamente
- Verificar se CORS está configurado no `main.ts`

### Erro de API Key

- Frontend não precisa de API key (backend gere)
- Verificar se `NEWSDATA_API_KEY` está configurada no Render

### Build errors

```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

MIT License - ver ficheiro `LICENSE` para detalhes.
