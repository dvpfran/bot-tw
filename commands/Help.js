const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');

const intro = '**List of Commands that you can use:**\n';
const listHelp = [
	'!player villages top[number]',
	'!player rank top[number]',
	'!player [name]',
	'!ally rank top[number]',
	'!ally villages top[number]',
	'!ally members top[number]',
	'!ally [name] OR [tag]',
	'!conquer last[number]',
	'!conquer today',
	'!conquer [date]',
	'!kill all top[number]',
	'!kill attack top[number]',
	'!kill defense top[number]',
	'!kill_ally all top[number]',
	'!kill_ally attack top[number]',
	'!kill_ally defense top[number]',
	'!world settings',
	'!world buildings [name]',
	'!world units [name]',
];

module.exports = {
	sendHelp: function(contentMessage) {
		let commands = '```';
		for (let index = 0; index < listHelp.length; index++) {
			commands += `${listHelp[index]}\n`;
		}
		Message.send(contentMessage.channel_id, contentMessage.guild_id, [intro + commands + '```']);
	}
}
