const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const port = process.env.PORT || 3000;

// Listens to a port, click the localhost link when you run the server to open it from here, no typing ik :)
const server = app.listen(port, () => {
  console.log('Listening on port => ' + port);
  console.log('http://localhost:' + port);
});

// Initialize Front-end folder
app.use(express.static(path.join(__dirname, 'public')));

// Socket setup
const io = socket(server);

// Establish a websocket connection
io.on('connection', socket => {
  // If someone joins the server, this message will get delivered to all
  // participants excepting the one who joins the server.
  socket.on('user connected', (user) => {
    socket.broadcast.emit('chat message', `Brace yourself ${user}, has joined the server.`);
    socket.broadcast.emit('add user online', `${user},${socket.id}`);
  });

  // If someone leaves the server, this message will get delivered to all
  // participants excepting the one who leaves the server.
  socket.on('disconnect', () => {
    socket.broadcast.emit('chat message', 'An user left the gang.');
    socket.broadcast.emit('remove user online', `${socket.id}`);
    socket.broadcast.emit("typing...", "");
  });

  // Whenever a message is send this will get delivered to all
  // participants excepting the one who sends the message.
  socket.on('chat message', msg => {
    socket.broadcast.emit('chat message', msg);
  });

  // If a user is typing, trigger this event to pass the user that is typing.
  socket.on('user is typing', user => {
    if (user) {
      socket.broadcast.emit('typing...', user);
    } else {
      socket.broadcast.emit('typing...', 'User not found');
    }
  });

  // If a user stop typing, trigger this event to pass an empty string.
  socket.on('user is not typing', user => {
    if (user) {
      socket.broadcast.emit('typing...', '');
    } else {
      socket.broadcast.emit('typing...', 'User not found');
    }
  });
});