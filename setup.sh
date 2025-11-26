#!/bin/bash

echo "🔧 Configurando o projeto..."

# Instalar dependências
echo "📦 Instalando dependências do backend..."
cd backend && npm install && cd ..

echo "📦 Instalando dependências do frontend..."
cd frontend && npm install && cd ..

# Corrigir permissões dos executáveis
echo "🔐 Corrigindo permissões..."
chmod +x backend/node_modules/.bin/* 2>/dev/null
chmod +x frontend/node_modules/.bin/* 2>/dev/null

# Rebuild do sqlite3 (caso necessário)
echo "🔨 Recompilando módulos nativos..."
cd backend && npm rebuild sqlite3 && cd ..

echo "✅ Configuração concluída!"
echo ""
echo "Para iniciar o projeto, execute:"
echo "  npm start"
echo ""
echo "Ou execute separadamente:"
echo "  Terminal 1: npm run start:backend"
echo "  Terminal 2: npm run start:frontend"

