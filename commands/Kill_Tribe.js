const Webhook = require('../config/Webhook');
const Command = require('./Command');
const Ally = require('./Ally');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } =  require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Kill_Tribe {
	constructor(rank, id, name, score) {
		this.rank = rank;
		this.id = id;
		this.name = name;
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
				const name = Ally.getName(item[1]);
				listKills.push(new Kill_Tribe(item[0], item[1], name, item[2]));
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
		listToSend.push([listKills[index].rank, listKills[index].name, formatNumber(listKills[index].score)]);
	}

	Table.setInfoTable(listToSend, ['Rank', 'Tribo', 'Derrotou']);

	let messages = [`**Número de Tribos: ${count}**\n`];
	let splitedTable = Table.generateTable();

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
			if (filterType === 'all' || filterType === 'atack' || filterType === 'defense') {
		getKillTribeList(filterType, number);
	}
		}
	}
}
