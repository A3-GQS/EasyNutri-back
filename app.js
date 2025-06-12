require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./config/logger'); // Adicione um sistema de logs

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com o banco de dados
connectDB();

// Middleware de logs
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP',
    dbState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
  });
});

// Rotas da aplicação
app.use('/api/users', require('./routes/users'));
app.use('/api/diets', require('./routes/diets'));
app.use('/api/calculations', require('./routes/calculations'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API EasyNutri funcionando',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manipulador de erros
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  logger.error(`Erro não tratado: ${err.stack}`);
  server.close(() => process.exit(1));
});

module.exports = server; // Para testes