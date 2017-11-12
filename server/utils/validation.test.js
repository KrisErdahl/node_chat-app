const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
	it('should reject non-string values', () => {
		const string = '{1}';
		const finalString = isRealString(string);

		expect(finalString).toBeFalsey;
	});

	it('should reject strings with only spaces', () => {
		const string = '          ';
		const finalString = isRealString(string);

		expect(finalString).toBeFalsey;
	});

	it('should allow string with non-space characters', () => {
		const string = ' Hi Jay ';
		const finalString = isRealString(string);

		expect(finalString).toBeTruthy;
	});
});
