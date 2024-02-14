const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Permitir todas as origens para Socket.IO
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('/', (req, res) => {
  res.send({
    code: 200,
    msg: "Servidor Online !"
  });
});

io.on('connection', (socket) => {
  console.log('Um cliente se conectou');
  socket.emit('status', true);

  // Receber mensagens do cliente
  socket.on('sendMessage', (data) => {
    console.log('Mensagem recebida:', data);

    // Enviar a mensagem para todos os clientes conectados, incluindo o remetente
    io.emit('receiveMessage', { nome: data.nome, msg: data.msg });
  });
});

// Iniciar o servidor na porta 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor Express está rodando em http://localhost:${port}`);
});
