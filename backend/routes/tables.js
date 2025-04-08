const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Listar arquivos JSON da pasta tables-taxes
router.get('/tabelas', (req, res) => {
  const dirPath = path.join(__dirname, '../public/tables-taxes');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    res.json(jsonFiles);
  });
});

// Upload de arquivo JSON
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/tables-taxes'),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Arquivo enviado com sucesso!' });
});

module.exports = router;