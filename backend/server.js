const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/tables-taxes", express.static(path.join(__dirname, "public/tables-taxes")));

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tableRoutes = require('./routes/tables');

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', tableRoutes);

// Em produção, servir arquivos estáticos do frontend
if (isProduction) {
  const frontendBuild = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendBuild));
  
  // Todas as rotas não-API servem o index.html do frontend (para React Router)
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuild, 'index.html'));
    }
  });
} else {
  // Em desenvolvimento, apenas mostra que a API está rodando
  app.get('/', (req, res) => {
    res.json({ 
      message: 'API Online',
      mode: 'development',
      frontend: 'Rodando separadamente na porta 5173'
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  if (!isProduction) {
    console.log(`📝 Modo: Desenvolvimento`);
    console.log(`🌐 Frontend: http://localhost:5173`);
  } else {
    console.log(`📝 Modo: Produção`);
    console.log(`🌐 Aplicação completa: http://localhost:${PORT}`);
  }
});
