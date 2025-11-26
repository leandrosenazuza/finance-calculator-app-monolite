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

// Atualizar tabela do usuário
router.put('/users/:id', (req, res) => {
  const { tabela } = req.body;
  const id = req.params.id;
  
  db.run('UPDATE users SET tabela = ? WHERE id = ?', [tabela, id], function(err) {
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