const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes  } = require('../config/Enums');

let worldBuildings = undefined;

function checkCommand(contentMessage, specificLevel = 0) {
	const command = contentMessage.command;
	let buildingArg = command.length > 2 ? command[2] : command[1];
	let building = undefined;

	switch(buildingArg) {
		case 'buildings':
			//building = worldBuildings;
			break;
		case 'main':
			building = worldBuildings.main;
			break;
		case 'barracks':
			building = worldBuildings.barracks;
			break;
		case 'stable':
			building = worldBuildings.stable;
			break;
		case 'garage':
			building = worldBuildings.garage;
			break;
		case 'watchtower':
			building = worldBuildings.watchtower;
			break;
		case 'snob':
			building = worldBuildings.snob;
			break;
		case 'smith':
			building = worldBuildings.smith;
			break;
		case 'place':
			building = worldBuildings.place;
			break;
		case 'statue':
			building = worldBuildings.statue;
			break;
		case 'market':
			building = worldBuildings.market;
			break;
		case 'wood':
			building = worldBuildings.wood;
			break;
		case 'stone':
			building = worldBuildings.stone;
			break; 
		case 'iron':
			building = worldBuildings.iron;
			break;
		case 'farm':
			building = worldBuildings.farm;
			break;
		case 'storage':
			building = worldBuildings.storage;
			break;
		case 'hide':
			building = worldBuildings.hide;
			break;
		case 'wall':
			building = worldBuildings.wall;
			break;
	}
	if (building !== undefined) {
		prepareMessage(contentMessage.channel_id, contentMessage.guild_id, buildingArg, building);
	}
}

function prepareMessage(channel_id ,guild_id, buildingName, building) {
	let listToSend = [];
	let columnsName = ['Edifício', 'Nível Mínimo', 'Nível Máximo'];
	listToSend.push([buildingName, building.min_level, building.max_level]);

	Table.setInfoTable(listToSend, columnsName);
	let message = `**Edifícios**\n`;
	message += '```'+ Table.generateTable() +'```\n';
	
	listToSend = [];
	
	columnsName = ['Nível', 'Madeira', 'Argila', 'Ferro', 'Pop'];
	let nextWood = building.wood;
	let nextStone = building.stone;
	let nextIron = building.iron;
	let nextPop = building.pop;

	for(let index = 0; index <= building.max_level; index++) {
		listToSend.push([index + 1, formatNumber(Math.round(nextWood)), formatNumber(Math.round(nextStone)), 
									formatNumber(Math.round(nextIron)), formatNumber(Math.round(nextPop))]);
		
		nextWood = nextWood * building.wood_factor;
		nextStone = nextStone * building.stone_factor;
		nextIron = nextIron * building.iron_factor;
		nextPop = nextPop * building.pop_factor;
	} 	

	Table.setInfoTable(listToSend, columnsName);
	const splitedTable = Table.generateTable();
	let messages = [message];
	for(let index = 0; index < splitedTable.length; index++) {
		messages.push('```'+ splitedTable[index]  +'```');
	}

	Message.send(channel_id, guild_id, messages);
}

module.exports = {
	loadInfo: function(result) {
		worldBuildings = result;
	}
}

module.exports.checkCommand = checkCommand;
