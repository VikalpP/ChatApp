const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Connections = [];

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is online at port ${PORT}...`));

app.use(express.static('client'));

const logOnlineUser = () => {
  console.clear();
  console.log(`Users online: ${Connections.length}`);
};

let typingUsers = {};
const currentlyTypingUsers = () => Object.keys(typingUsers);

io.on('connection', socket => {
  Connections.push(socket);
  logOnlineUser();

  socket.on('disconnect', () => {
    Connections.splice(Connections.indexOf(socket), 1);
    logOnlineUser();
  });

  socket.on('myUserName', UserName => {
    socket.username = UserName;
  });

  socket.on('message', message => {
    const { username } = socket;
    socket.broadcast.emit('chatMessage', { username, message });
  });

  const emitCurrentlyTypingUsers = () => {
    const users = currentlyTypingUsers();
    const emitMsg = users.length > 0 ? 'typing' : 'stopTyping';
    socket.broadcast.emit(emitMsg, users);
  };

  socket.on('typing', () => {
    if (!typingUsers[socket.username]) typingUsers[socket.username] = true;
    emitCurrentlyTypingUsers();
  });

  socket.on('stopTyping', () => {
    delete typingUsers[socket.username];
    emitCurrentlyTypingUsers();
  });
});
