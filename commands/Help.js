const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');

const intro = 'List of Commands that you can use:\n';
const listHelp = [
	'!player villages top[number]',
	'!player rank top[number]',
	'!player [name]',
	'!ally rank top[number]',
	'!ally villages top[number]',
	'!ally members top[number]',
	'!conquer last[number]',
	'!conquer today',
	'!conquer [date]',
	'!kill all top[number]',
	'!kill atack top[number]',
	'!kill defense top[number]',
	'!kill_ally all top[number]',
	'!kill_ally atack top[number]',
	'!kill_ally defense top[number]',
	'!world settings',
	'!world buildings [name]',
	'!world units [name]',
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
