const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars');

const intro = 'List of Commands that you can use:\n';
const listHelp = [
	'!player points top[number]',
	'!player village top[number]',
	'!player rank top[number]',
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
