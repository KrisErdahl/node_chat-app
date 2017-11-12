const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
	let users;

	beforeEach(() => {
		users = new Users();
		users.users = [
			{
				id: '1',
				name: 'Mike',
				room: 'Node Course'
			},
			{
				id: '2',
				name: 'Susan',
				room: 'React Course'
			},
			{
				id: '3',
				name: 'Jen',
				room: 'Node Course'
			}
		];
	});

	it('should add new user', () => {
		const users = new Users();
		const user = { id: '123', name: 'Kris', room: 'The Office Fans' };
		const resUser = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('should remove a user', () => {
		const user = users.removeUser('2');

		expect(user.id).toBe('2');
		expect(users.users.length).toBe(2);
	});

	it('should not remove a user', () => {
		const user = users.removeUser('20');

		expect(user).toNotExist();
		expect(users.users.length).toBe(3);
	});

	it('should find a user', () => {
		const user = users.getUser('3');

		expect(user.id).toBe('3');
	});

	it('should not find a user', () => {
		const user = users.getUser('30');

		expect(user).toNotExist();
	});

	it('should return names for node course', () => {
		const userList = users.getUserList('Node Course');

		expect(userList).toEqual(['Mike', 'Jen']);
	});

	it('should return names for react course', () => {
		const userList = users.getUserList('React Course');

		expect(userList).toEqual(['Susan']);
	});
});
