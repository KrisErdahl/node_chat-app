const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
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

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and room name are required');
		} else {
			socket.join(params.room);
			//socket.leave(params.room) is also an option

			socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

			socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

			callback();
		}
	});

	//listener
	socket.on('createMessage', (message, callback) => {
		// console.log('create message', message);
		//Send to everyone except sender
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
		//Send to all
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('createLocationMessage', coords => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', socket => {
		console.log('user disconnected');
	});
});

server.listen(port, () => {
	console.log(`started up at port ${port}`);
});

module.exports = { app };
