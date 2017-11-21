var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// var mysql = require('mysql');
Users = {};
Connections = [];

server.listen(4000, () => {
  console.log('Server is online at localhost:4000...');
});

app.use(express.static('client'));


// var con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'chatapp'
// });
// con.connect((err) => {
//   if (err) console.log('Error while connecting to mysql...');
// });


io.on('connection', (socket) => {
  Connections.push(socket);
  console.log('Users online: %s', Connections.length);

  socket.on('disconnect', () => {
    Connections.splice(Connections.indexOf(socket), 1);
    console.log('Users online: %s', Connections.length);
  });

  socket.emit('myUserName', (UserName) => {
    Users[socket.UserName] = socket;
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('chatMessge', data);
  });

  // con.query("INSERT INTO ")

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

});