const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Teste OK'));

app.listen(3000, () => {
  console.log('Servidor teste rodando na porta 3000');
});