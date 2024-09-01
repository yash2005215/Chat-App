const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    socket.on('user joined', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user joined', username);
    });

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
