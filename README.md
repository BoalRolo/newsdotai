# NewsDotAI

Uma aplicação React moderna para buscar e exibir notícias usando a NewsData.io API, com backend NestJS para resolver problemas de CORS.

## 🚀 Estrutura do Projeto

```
newsdotai/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços de API
│   └── types/             # Definições TypeScript
├── server/                # Backend NestJS (Proxy API)
│   ├── src/
│   │   ├── news/          # Módulo de notícias
│   │   └── main.ts        # Ponto de entrada
│   └── package.json
└── package.json           # Frontend package.json
```

## 🛠️ Tecnologias

### Frontend

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para styling
- **React Router** para navegação
- **Firebase** para autenticação e base de dados

### Backend

- **NestJS** para API proxy
- **Axios** para requisições HTTP
- **CORS** configurado para frontend

## 📦 Instalação

### 1. Instalar dependências

```bash
# Instalar dependências do frontend e backend
npm run install:all
```

### 2. Configurar variáveis de ambiente

#### Frontend (.env)

```env
VITE_NEWS_API_KEY=sua_chave_do_newsdata.io
VITE_FIREBASE_API_KEY=sua_chave_firebase
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Backend (server/.env)

```env
NEWSDATA_API_KEY=sua_chave_do_newsdata.io
```

## 🚀 Como Executar

### Opção 1: Arrancar tudo de uma vez (Recomendado)

```bash
npm run dev:full
```

Isto arranca tanto o backend (porta 3001) como o frontend (porta 5173).

### Opção 2: Arrancar separadamente

#### Backend (Terminal 1)

```bash
npm run server:dev
```

Backend disponível em: http://localhost:3001

#### Frontend (Terminal 2)

```bash
npm run dev
```

Frontend disponível em: http://localhost:5173

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Arrancar apenas frontend
npm run server:dev       # Arrancar apenas backend
npm run dev:full         # Arrancar frontend + backend

# Build
npm run build            # Build do frontend
npm run server:build     # Build do backend

# Deploy
npm run deploy           # Deploy para GitHub Pages

# Instalação
npm run install:all      # Instalar dependências de frontend + backend
```

## 🌐 Endpoints da API

### Backend NestJS (Proxy)

- `GET /api/news` - Buscar notícias da NewsData.io
  - Parâmetros: `q`, `language`, `country`, `category`, `page`

### Exemplos de uso

```bash
# Notícias de desporto em Portugal
curl "http://localhost:3001/api/news?country=pt&category=sports"

# Notícias sobre Sporting CP
curl "http://localhost:3001/api/news?q=SportingCP&language=pt"
```

## 🔐 Configuração do Firebase

1. Criar projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativar Authentication e Firestore
3. Configurar regras de segurança do Firestore
4. Adicionar as variáveis de ambiente no `.env`

## 📱 Funcionalidades

- ✅ Autenticação com Firebase
- ✅ Busca de notícias por tópicos
- ✅ Tema claro/escuro
- ✅ Gestão de tópicos pessoais
- ✅ Proxy API para resolver CORS
- ✅ Interface responsiva
- ✅ Deploy automático para GitHub Pages

## 🚀 Deploy

### GitHub Pages

```bash
npm run deploy
```

### Backend (Opcional)

O backend pode ser deployado em:

- **Render**
- **Railway**
- **Vercel**
- **Heroku**

## 🤝 Contribuição

1. Fork o projeto
2. Criar branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit as mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Ver o ficheiro `LICENSE` para mais detalhes.
