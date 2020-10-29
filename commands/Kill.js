const Webhook = require('../config/Webhook');
const Player = require('./Player');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Kill {
	constructor(rank, id, player_name, score) {
		this.rank = rank;
		this.id = id;
		this.player_name = player_name;
		this.score = score;
	}
}

let listKills = [];

function getKillList(filterType, number) {
	let infoType = null;
	switch(filterType) {
		case 'all':
			infoType = TribalWarsInfoType.KILL_ALL;
			break;
		case 'atack':
			infoType = TribalWarsInfoType.KILL_ATT;
			break;
		case 'defense':
			infoType = TribalWarsInfoType.KILL_DEF;
			break;
	}
	
	if (infoType != null) {
		listKills = [];
		TribalWars.getInfo(infoType).then((result) => {
			for(let index = 0; index < result.length; index++) {
				const item = result[index].split(',');
				const player_name = Player.getName(item[1]);
				listKills.push(new Kill(item[0], item[1], player_name, item[2]));
			}
		}).then(() => {
			sortListKills();
		}).then(() => {
			sendKills(number);
		});		
	}
}

function sortListKills() {
	listKills.sort((a, b) => {
		return a.rank - b.rank;
	});
}

function sendKills(count) {
	let listToSend = [];
	for(let index = 0; index < count; index++) {
		listToSend.push([listKills[index].rank, listKills[index].player_name, formatNumber(listKills[index].score)]);
	}

	Table.setInfoTable(listToSend, ['Rank', 'Nome', 'Derrotou']);
	const splitedTable = Table.generateTable();
	const messages = [];
	messages.push(`**Número de Jogadores: ${count}**\n`);

	for(let index = 0; index < splitedTable.length; index++) {
		messages.push('```'+ splitedTable[index] +'```\n');
	}
	Webhook.sendMessage(messages);
}

module.exports = {	
	checkCommand: function(args) {
		const filterType = args[0];
		const filter = args[1];

		if (filter.includes('top')) {
			const number = parseInt(filter.substr('top'.length));
			if (filterType === 'all' ||  filterType === 'atack' || filterType === 'defense') {
				getKillList(filterType, number);
			}
		}
	}
}
