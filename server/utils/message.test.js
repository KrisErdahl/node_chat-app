const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
	//syncronous test
	it('should generate the correct message object', () => {
		const from = 'Jen';
		const text = 'Message!';
		const message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message.text).toBe(text);
		expect(message.from).toBe(from);
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		const from = 'Susan';
		const latitude = 1.5;
		const longitude = 3.6;
		const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
		const message = generateLocationMessage(from, latitude, longitude);

		expect(message.from).toBe(from);
		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({ from, url });
		expect(message.url).toBe(url);
		//assert from, createdAd is a number, url prop is expected
	});
});
