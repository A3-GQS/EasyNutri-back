const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1
    });
    console.log('MongoDB conectado com sucesso');
  } catch (err) {
    console.error('Erro na conexão com MongoDB:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Erro na conexão do Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;