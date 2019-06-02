const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Users = {};
const Connections = [];

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is online at port ${PORT}...`));

app.use(express.static('client'));

io.on('connection', socket => {
  Connections.push(socket);
  console.log('Users online: %s', Connections.length);

  socket.on('disconnect', () => {
    Connections.splice(Connections.indexOf(socket), 1);
    console.log('Users online: %s', Connections.length);
  });

  socket.emit('myUserName', UserName => {
    Users[socket.UserName] = socket;
  });

  socket.on('message', data => {
    socket.broadcast.emit('chatMessge', data);
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', data);
  });
});
