const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/tables-taxes", express.static(path.join(__dirname, "public/tables-taxes")));

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tableRoutes = require('./routes/tables');

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', tableRoutes);

app.get('/', (req, res) => {
  res.send('API Online');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
