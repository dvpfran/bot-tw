const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes  } = require('../config/Enums');
const { language } = require('../languages/language');

let worldUnits = undefined;

function checkCommand(contentMessage) {
	const command = contentMessage.command;
	let unitArg = command.length > 2 ? command[2] : command[1];
	let unit = undefined;

	switch(unitArg) {
		case 'spear':
			unit = worldUnits.spear;		
			break;
		case 'sword':
			unit = worldUnits.sword;
			break;
		case 'axe':
			unit = worldUnits.axe;
			break;
		case 'archer':
			unit = worldUnits.archer;
			break;
		case 'spy':
			unit = worldUnits.spy;
			break;
		case 'light':
			unit = worldUnits.light;
			break;
		case 'marcher':
			unit = worldUnits.marcher;
			break;
		case 'heavy':
			unit = worldUnits.heavy;
			break;
		case 'ram':
			unit = worldUnits.ram;
			break;
		case 'catapult':
			unit = worldUnits.catapult;
			break;
		case 'knight':
			unit = worldUnits.knight;
			break;
		case 'snob':
			unit = worldUnits.snob;
			break;
		case 'militia':
			unit = worldUnits.militia;
			break;
	}
	if (unit !== undefined) {
		prepareMessage(contentMessage, unitArg, unit);
	}
}

function prepareMessage(contentMessage, unitName, unit) {
	let listToSend = [];
	let columnsName = [language.name, 'Pop', language.speed, language.attack, language.defense, language.cavalry_defense, language.archer_defense, language.haul];

	listToSend.push([language.units_obj[unitName], unit.pop, parseInt(unit.speed), unit.attack, unit.defense, unit.defense_cavalry, unit.defense_archer, unit.carry]);

	Table.setInfoTable(listToSend, columnsName);
	let messages = [`**${language.units}**\n`];
	const splitedTable = Table.generateTable();

	for(let index = 0; index < splitedTable.length; index++) {
		 messages.push('```'+ Table.generateTable() +'```\n');
	}
	
	Message.send(contentMessage.channel_id, contentMessage.guild_id, messages);
}

module.exports = {
	loadInfo: function(result) {
		worldUnits = result;
	}
}

module.exports.checkCommand = checkCommand;
