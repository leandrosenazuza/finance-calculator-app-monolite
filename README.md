# Finance Calculator App

Aplicação de calculadora financeira unificada com backend Node.js/Express e frontend React/Vite.

## Estrutura do Projeto

- **backend/**: API Node.js com Express e SQLite
- **frontend/**: Aplicação React com Vite
- **Projeto Unificado**: Backend serve o frontend em produção

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm

## Instalação

### Opção 1: Script automático (recomendado)

```bash
npm run setup
```

ou

```bash
bash setup.sh
```

### Opção 2: Instalação manual

```bash
npm install
```

Isso instalará todas as dependências do backend e frontend.

**Importante:** Se encontrar erros de permissão ao rodar, execute:

```bash
npm run fix-permissions
```

## Como Rodar

### Desenvolvimento

```bash
npm run dev
```

Isso iniciará:
- Backend na porta 3001 (http://localhost:3001)
- Frontend na porta 5173 (http://localhost:5173)

### Produção

```bash
# 1. Build do frontend
npm run build

# 2. Iniciar servidor (serve backend + frontend)
npm start
```

Em produção, tudo roda em uma única porta (3001):
- Backend API: http://localhost:3001/api/*
- Frontend: http://localhost:3001/*

## Scripts Disponíveis

- `npm run dev` - Inicia backend e frontend em modo desenvolvimento
- `npm run build` - Compila o frontend para produção
- `npm start` - Inicia servidor em modo produção (requer build prévio)
- `npm run install` - Instala todas as dependências
- `npm run setup` - Script completo de configuração

## Endpoints da API

- `GET /` - Verifica se a API está online (dev) ou serve frontend (prod)
- `POST /api/login` - Login de usuário
- `GET /api/users` - Lista todos os usuários
- `POST /api/users` - Cria novo usuário
- `PUT /api/users/:id` - Atualiza tabela e/ou senha do usuário
- `DELETE /api/users/:id` - Exclui usuário
- `GET /api/tabelas` - Lista arquivos JSON de tabelas
- `POST /api/upload` - Upload de arquivo JSON

## Banco de Dados

O projeto usa SQLite. O banco de dados está localizado em `backend/database/db.sqlite`.

A tabela `users` já existe no banco de dados.

## Deploy

Para fazer deploy em produção:

1. Instale as dependências:
```bash
npm install
```

2. Faça o build do frontend:
```bash
npm run build
```

3. Configure a variável de ambiente (opcional):
```bash
export NODE_ENV=production
export PORT=3001
```

4. Inicie o servidor:
```bash
npm start
```

O servidor irá servir tanto a API quanto o frontend na mesma porta.

## Compartilhar Localmente

Para permitir que amigos acessem na mesma rede Wi-Fi:

1. Inicie o servidor: `npm run dev`
2. Anote o IP que aparece no terminal (ex: `http://192.168.1.100:3001`)
3. Compartilhe esse link com seu amigo
4. Ambos precisam estar na mesma rede Wi-Fi

Para acesso externo (de qualquer lugar), use ngrok:
```bash
npx ngrok http 3001
```

📖 Veja [COMPARTILHAR.md](./COMPARTILHAR.md) para instruções detalhadas.

## Notas

- Em desenvolvimento, o frontend usa proxy para `/api` apontando para `http://localhost:3001`
- Em produção, o Express serve os arquivos estáticos do frontend compilado
- Todas as rotas não-API servem o `index.html` do React Router em produção
- O servidor aceita conexões de qualquer IP (0.0.0.0) para permitir acesso na rede local
