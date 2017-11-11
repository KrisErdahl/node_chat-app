//jan 1, 1970 00:00:00 am is timestamp 0
//1 ms change in JS

const moment = require('moment');

const someTimeStamp = moment().valueOf();
console.log(someTimeStamp);
const createdAt = 1234;
const date = moment(1234);
console.log(date.format('MMM Do, YYYY h:mm:ss a'));

const dateNow = moment();
console.log(date.format('h:mm a'));
