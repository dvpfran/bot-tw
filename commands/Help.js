const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');

const intro = 'List of Commands that you can use:\n';
const listHelp = [
	'!player points top[number]',
	'!player villages top[number]',
	'!player rank top[number]',
	'!conquer last[number]',
	'!conquer today',
	'!conquer [date]',
	'!kill all top[number]',
	'!kill atack top[number]',
	'!kill defense top[number]',
	'!kill_tribe all top[number]',
	'!kill_tribe atack top[number]',
	'!kill_tribe defense top[number]',
	'!world settings',
];

module.exports = {
	sendHelp: function() {
		let commands = '';
		for (let index = 0; index < listHelp.length; index++) {
			commands += `${listHelp[index]}\n`;
		}
		Webhook.sendMessage(intro + commands);
	}
}
