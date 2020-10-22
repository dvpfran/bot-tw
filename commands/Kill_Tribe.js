const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } =  require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Kill_Tribe {
	constructor(rank, id, score) {
		this.rank = rank;
		this.id = id;
		this.score = score;
	}
}

let listKills = [];

function getKillTribeList(filterType, number) {
	let infoType = null;
	switch(filterType) {
		case 'all':
			infoType = TribalWarsInfoType.KILL_ALL_TRIBE;
			break;
		case 'atack':
			infoType = TribalWarsInfoType.KILL_ATT_TRIBE;
			break;
		case 'defense':
			infoType = TribalWarsInfoType.KILL_DEF_TRIBE;
			break;
	}

	if (infoType != null) {
		listKills = [];
		TribalWars.getInfo(infoType).then((result) => {
			for(let index = 0; index < result.length; index++) {
				const item = result[index].split(',');
				listKills.push(new Kill_Tribe(item[0], item[1], item[2]));
			}
		}).then(() => {
			sortList();
		}).then(() => {
			sendKills(number);
		});
	}
}

function sortList() {
	listKills.sort((a, b) => {
		return a.rank - b.rank;
	});
}

function sendKills(count) {
	let listToSend = [];
	for(let index = 0; index < count; index++) {
		listToSend.push([listKills[index].rank, listKills[index].id, formatNumber(listKills[index].score)]);
	}

	Table.setInfoTable(listToSend, ['Rank', 'Tribo', 'Derrotou']);
	let message = `**Número de Tribos: ${count}**\n`;
	message += '```'+ Table.generateTable() +'```\n';
	Webhook.sendMessage(message);
}

module.exports = {
	checkCommand: function(args) {
		const filterType = args[0];
		const filter = args[1];

		if (filter.includes('top')) {
			const number = parseInt(filter.substr('top'.length));
			if (filterType === 'all' || filterType === 'atack' || filterType === 'defense') {
		getKillTribeList(filterType, number);
	}
		}
	}
}
