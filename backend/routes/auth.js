
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro interno' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Login inválido' });
      }

      res.json(row);
    }
  );
});

module.exports = router;
