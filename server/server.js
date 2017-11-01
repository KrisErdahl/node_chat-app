const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3500;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connection', socket => {
	console.log('new user connected');

	socket.on('disconnect', socket => {
		console.log('user disconnected');
	});
});

server.listen(port, () => {
	console.log(`started up at port ${port}`);
});

module.exports = { app };
