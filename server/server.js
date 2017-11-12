const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const port = process.env.PORT || 3500;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// provide new Users for methods below
const users = new Users();
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
			return callback('Name and room name are required');
		} else {
			socket.join(params.room);
			//socket.leave(params.room) is also an option
			users.removeUser(socket.id);
			users.addUser(socket.id, params.name, params.room);
			io.to(params.room).emit('updateUserList', users.getUserList(params.room));

			socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

			socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

			callback();
		}
	});

	//listener
	socket.on('createMessage', (message, callback) => {
		const user = users.getUser(socket.id);
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		// console.log('create message', message);
		//Send to everyone except sender
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
		//Send to all

		callback();
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('createLocationMessage', coords => {
		const user = users.getUser(socket.id);
		if (user) {
			io
				.to(user.room)
				.emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	});

	socket.on('disconnect', () => {
		// console.log('user disconnected');
		const user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`));
		}
	});
});

server.listen(port, () => {
	console.log(`started up at port ${port}`);
});

module.exports = { app };
