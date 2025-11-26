const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todos os usuários
router.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar novo usuário
router.post('/users', (req, res) => {
  const { name, username, password, type, tabela } = req.body;
  db.run('INSERT INTO users (name, username, password, type, tabela) VALUES (?, ?, ?, ?, ?)',
    [name, username, password, type, tabela],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Atualizar usuário
router.put('/users/:id', (req, res) => {
  const { name, username, password, type, tabela } = req.body;
  const id = req.params.id;
  
  let query, params;
  
  if (password) {
    // Se senha foi fornecida, atualiza tudo incluindo senha
    query = 'UPDATE users SET name = ?, username = ?, password = ?, type = ?, tabela = ? WHERE id = ?';
    params = [name, username, password, type, tabela, id];
  } else {
    // Se senha não foi fornecida, mantém a senha atual
    query = 'UPDATE users SET name = ?, username = ?, type = ?, tabela = ? WHERE id = ?';
    params = [name, username, type, tabela, id];
  }
  
  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// Excluir usuário
router.delete('/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;