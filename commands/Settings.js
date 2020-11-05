const config = require('config');

const database = require('../config/Database');
const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

function checkCommand(contentMessage) {
	if(contentMessage.command.length >= 3) {
		const command = contentMessage.command;
		const type = command[1];
		let value = command;
		value.splice(0, 2);
		value = value.toString().replace(/\,/g, ' ');
		console.log(value);
		
		if (type === 'server' || type === 'world' || type === 'language') {
			setValue(contentMessage.channel_id, type, value);
		}
	}
}

function setValue(channel_id, field, value) {
	let query = '';
	let values = [];
	
	database.query('SELECT COUNT(*) FROM settings WHERE channel_id = $1', [channel_id]).then(result => {	
		console.log('resultado:', result);
		if (result[0].count ===  '1') {
			database.query(`UPDATE settings SET ${field} = $1 WHERE channel_id = $2`, [value, channel_id]).then(result => { 
				console.log('resultado:', result);	
			});
		}
		else {
			database.query(`INSERT INTO settings (channel_id, ${field}) VALUES($1, $2)`, [channel_id, value]);
		}
	});
}

function setDefaultValues() {
	selectedWorld = config.get('TribalWarsConfig.world')
	selectedServer = config.get('TribalWarsConfig.server')
}
 
module.exports.checkCommand = checkCommand;
module.exports.setDefaultValues = setDefaultValues;
