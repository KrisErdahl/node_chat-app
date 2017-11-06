const socket = io();

socket.on('connect', function() {
	console.log('connected to server');

	// socket.emit('createMessage', {
	// 	from: 'Kris',
	// 	text: 'Hey group!'
	// });
});

socket.on('disconnect', function() {
	console.log('diconnected from server');
});

//listener for event newEmail
socket.on('newMessage', function(message) {
	console.log('new message', message);
});
