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

	//emitter with what should be sent to client
	// socket.emit('newMessage', {
	// 	from: 'you',
	// 	text: 'Hey.  How are you?',
	// 	createdAt: 123
	// });

	//listener
	socket.on('createMessage', message => {
		// console.log('create message', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	});

	socket.on('disconnect', socket => {
		console.log('user disconnected');
	});
});

server.listen(port, () => {
	console.log(`started up at port ${port}`);
});

module.exports = { app };
