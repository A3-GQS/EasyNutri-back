require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
connectDB();

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API EasyNutri funcionando' });
});

// Rotas da aplicação
app.use('/api/users', require('./routes/Users'));
app.use('/api/diets', require('./routes/Diets'));
app.use('/api/calculations', require('./routes/Calculations'));

// Manipulador de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});