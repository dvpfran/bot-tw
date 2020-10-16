const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Kill {
	constructor(rank, id, score) {
		this.rank = rank;
		this.id = id;
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
				listKills.push(new Kill(item[0], item[1], item[2]));
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
		listToSend.push([listKills[index].rank, listKills[index].id, listKills[index].score.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&.')]);
	}
	
	Table.setInfoTable(listToSend, ['Rank', 'Nome', 'Derrotou']);
	let message = `**Número de Jogadores: ${count}**\n`;
	message += '```'+ Table.generateTable() +'```\n';
	Webhook.sendMessage(message);
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
