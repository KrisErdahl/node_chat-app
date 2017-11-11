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
	const li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
	console.log('message', message);
	const li = jQuery('<li></li>');
	const a = jQuery('<a target = "_blank">My Current Location</a>');
	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
	jQuery('#messages').append(li);
});

// Tester for initial setup -> fake user Frank says hi
// socket.emit(
// 	'createMessage',
// 	{
// 		from: 'Frank',
// 		text: 'Hi'
// 	},
// 	function(dataFromCallback) {
// 		console.log('got it', dataFromCallback);
// 	}
// );

// turn off default browser behavior of page refresh
jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit(
		'createMessage',
		{
			from: 'User',
			text: jQuery('[name=message]').val()
		},
		function() {}
	);
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser');
	} else {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				// console.log(position);
				socket.emit('createLocationMessage', {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			function() {
				alert('Unable to fetch location.');
			}
		);
	}
});
