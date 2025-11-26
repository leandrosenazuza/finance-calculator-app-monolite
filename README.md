# Finance Calculator App

Aplicação de calculadora financeira com backend Node.js/Express e frontend React/Vite.

## Estrutura do Projeto

- **backend/**: API Node.js com Express e SQLite
- **frontend/**: Aplicação React com Vite

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
npm run install:all
```

Ou instalar manualmente:

```bash
cd backend && npm install
cd ../frontend && npm install
```

**Importante:** Se encontrar erros de permissão ao rodar, execute:

```bash
npm run fix-permissions
```

## Como Rodar

### Opção 1: Rodar tudo de uma vez (recomendado)

```bash
npm start
```

Isso iniciará:
- Backend na porta 3001 (http://localhost:3001)
- Frontend na porta padrão do Vite (geralmente http://localhost:5173)

### Opção 2: Rodar separadamente

**Terminal 1 - Backend:**
```bash
npm run start:backend
```

**Terminal 2 - Frontend:**
```bash
npm run start:frontend
```

## Endpoints da API

- `GET /` - Verifica se a API está online
- `POST /api/login` - Login de usuário
- `GET /api/users` - Lista todos os usuários
- `POST /api/users` - Cria novo usuário
- `DELETE /api/users/:id` - Exclui usuário
- `GET /api/tabelas` - Lista arquivos JSON de tabelas
- `POST /api/upload` - Upload de arquivo JSON

## Banco de Dados

O projeto usa SQLite. O banco de dados está localizado em `backend/database/db.sqlite`.

A tabela `users` já existe no banco de dados.

## Notas

- O frontend está configurado para fazer proxy das requisições `/api` para o backend em `http://localhost:3001`
- Certifique-se de que a porta 3001 está livre antes de iniciar o backend
