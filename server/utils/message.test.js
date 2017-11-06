const expect = require('expect');

const { generateMessage } = require('./message');

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
