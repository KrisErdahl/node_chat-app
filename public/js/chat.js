const socket = io();

function scrollToBottom() {
	// Selectors
	const messages = jQuery('#messages');
	const newMessage = messages.children('li:last-child');
	// Heights
	const clientHeight = messages.prop('clientHeight');
	const scrollTop = messages.prop('scrollTop');
	const scrollHeight = messages.prop('scrollHeight');
	const newMessageHeight = newMessage.innerHeight();
	const lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		// console.log('should scroll');
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	// console.log('connected to server');
	const params = jQuery.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
	// socket.emit('createMessage', {
	// 	from: 'Kris',
	// 	text: 'Hey group!'
	// });
});

socket.on('disconnect', function() {
	console.log('diconnected from server');
});

socket.on('updateUserList', function(users) {
	// console.log('Users List', users);
	const ol = jQuery('<ol></ol>');

	users.forEach(function(user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
});

//listener for event newEmail
socket.on('newMessage', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#message-template').html();
	const html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
	// console.log('new message', message);
	// const formattedTime = moment(message.createdAt).format('h:mm a');
	// const li = jQuery('<li></li>');
	// li.text(`${message.from} at ${formattedTime}: ${message.text}`);
	//
	// jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
	// console.log('message', message);
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#location-message-template').html();
	const html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
	// const li = jQuery('<li></li>');
	// const a = jQuery('<a target = "_blank">My Current Location</a>');
	// li.text(`${message.from} at ${formattedTime}: `);
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
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

	const messageTextbox = jQuery('[name=message]');
	socket.emit(
		'createMessage',
		{
			// from: 'User',
			text: messageTextbox.val()
		},
		function() {
			messageTextbox.val('');
		}
	);
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser');
	} else {
		locationButton.attr('disabled', 'disabled').text('Sending location...');
		navigator.geolocation.getCurrentPosition(
			function(position) {
				// console.log(position);
				locationButton.removeAttr('disabled').text('Send location');
				socket.emit('createLocationMessage', {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			function() {
				locationButton.removeAttr('disabled').text('Send location');
				alert('Unable to fetch location.');
			}
		);
	}
});
