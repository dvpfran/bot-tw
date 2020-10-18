const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes  } = require('../config/Enums');

let worldUnits = undefined;

function checkCommand(args) {
	let unitArg = Array.isArray(args) ? args[1] : args;
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
			unit = worldUnits.have;
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
		prepareMessage(unitArg, unit);
	}
}

function prepareMessage(unitName, unit) {
	let listToSend = [];
	let columnsName = ['Unidade', 'Pop', 'Velocidade', 'Ataque', 'Defesa', 'Defesa Cavalaria', 'Defesa Arqueiro', 'Carga'];

	/* sendMessage(message).then(() => {
	   		sendMessage(message1);
	   });
	*/	
}

function sendMessage(message) {
	return new Promise((resolve) => {
		setTimeout(() => {
			Webhook.sendMessage(message);
			resolve();
		}, 800);
	});
}

module.exports = {
	loadInfo: function() {
		TribalWars.getInfo(TribalWarsInfoType.UNITS, 'xml').then((result) => {
			worldUnits = result.config;
		});
	}
}

module.exports.checkCommand = checkCommand;