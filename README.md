# NewsDotAI - Jornal Diário Personalizado

Uma aplicação web moderna para curar notícias personalizadas baseadas em palavras-chave e tópicos.

## 🚀 Funcionalidades

- ✅ Interface moderna e responsiva com modo claro/escuro
- ✅ Adição de palavras-chave e categorização por tópicos
- ✅ Busca de notícias em tempo real via NewsData.io API
- ✅ Exibição organizada de notícias por tópico
- ✅ Design techy e minimalista
- ✅ Persistência de preferências no localStorage

## 🛠️ Stack Tecnológica

- **Frontend**: React + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **API**: NewsData.io

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   - Copie o arquivo `.env.example` para `.env`
   - Obtenha uma API key gratuita em [NewsData.io](https://newsdata.io/)
   - Configure as variáveis no arquivo `.env`:

     ```env
     # API Key (obrigatória)
     VITE_NEWSDATA_API_KEY=sua_api_key_aqui

     # API Base URL (opcional - padrão: NewsData.io)
     VITE_NEWSDATA_API_BASE_URL=https://newsdata.io/api/1/news
     ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

## 🎯 Como Usar

1. **Adicionar Tópicos**: Digite palavras-chave (ex: "Sporting", "Bitcoin") e selecione uma categoria
2. **Buscar Notícias**: Clique em "SEARCH NEWS" para buscar notícias relacionadas
3. **Visualizar**: As notícias aparecem organizadas por tópico com imagens e links
4. **Alternar Tema**: Use o botão "LIGHT/DARK" para mudar o tema

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── LabelTopicManager.tsx  # Componente principal
│   └── NewsDisplay.tsx        # Exibição de notícias
├── hooks/
│   └── useNews.ts            # Hook para gerenciar notícias
├── services/
│   └── newsApi.ts           # Serviço da API de notícias
├── types/
│   └── news.ts              # Tipos TypeScript
└── ...
```

## 🔧 Configuração da API

A aplicação usa a API NewsData.io para buscar notícias. Para configurar:

1. Acesse [NewsData.io](https://newsdata.io/)
2. Crie uma conta gratuita
3. Obtenha sua API key
4. Configure no arquivo `.env`:
   ```env
   VITE_NEWSDATA_API_KEY=sua_api_key_aqui
   VITE_NEWSDATA_API_BASE_URL=https://newsdata.io/api/1/news
   ```

### Variáveis de Ambiente

| Variável                     | Obrigatória | Padrão                           | Descrição              |
| ---------------------------- | ----------- | -------------------------------- | ---------------------- |
| `VITE_NEWSDATA_API_KEY`      | ✅          | -                                | API key do NewsData.io |
| `VITE_NEWSDATA_API_BASE_URL` | ❌          | `https://newsdata.io/api/1/news` | URL base da API        |

## 🎨 Design

- **Modo Escuro**: Fundo escuro com gradientes azuis/roxos
- **Modo Claro**: Fundo claro com sombras sutis
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Animações**: Transições suaves e efeitos hover

## 🚧 Próximos Passos

- [ ] Geração de PDF com as notícias
- [ ] Envio por email diário
- [ ] Backend para persistir preferências
- [ ] Mais opções de categorização
- [ ] Filtros por data e fonte

## 📄 Licença

MIT
