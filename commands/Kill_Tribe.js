const Message = require('../config/Message');
const Command = require('./Command');
const Ally = require('./Ally');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } =  require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');
const { language } = require('../languages/language'); 

class Kill_Tribe {
	constructor(rank, id, name, score) {
		this.rank = rank;
		this.id = id;
		this.name = name;
		this.score = score;
	}
}

function getKillTribeList(contentMessage, filterType, number) {
	const channel_id = contentMessage.channel_id;
	let listKills = [];
	let infoType = null;
	switch(filterType) {
		case 'all':
			infoType = TribalWarsInfoType.KILL_ALL_TRIBE;
			break;
		case 'attack':
			infoType = TribalWarsInfoType.KILL_ATT_TRIBE;
			break;
		case 'defense':
			infoType = TribalWarsInfoType.KILL_DEF_TRIBE;
			break;
	}

	if (infoType != null) {
		listKills = [];
		TribalWars.getInfo(channel_id, infoType).then((result) => {
			for(let index = 0; index < result.length; index++) {
				const item = result[index].split(',');
				const name = Ally.getName(item[1]);
				listKills.push(new Kill_Tribe(item[0], item[1], name, item[2]));
			}
		}).then(() => {
			listKills.sort((a, b) => {
				return a.rank - b.rank;
			});
		}).then(() => {
			let sortedList = [];
			for(let index = 0; index < number; index++) {
				sortedList.push([listKills[index].rank, listKills[index].name, formatNumber(listKills[index].score)]);
			}
			if(sortedList.length > 0) {
				sendKills(contentMessage.channel_id, contentMessage.guild_id, sortedList);
			}
		});
	}
}

function sendKills(channel_id, guild_id, kills) {
	Table.setInfoTable(kills, [language.rank, language.tribe, language.defeated]);

	let messages = [];
	let splitedTable = Table.generateTable();

	for(let index = 0; index < splitedTable.length; index++) {
		messages.push('```'+ splitedTable[index] +'```\n');
	}
	Message.send(channel_id, guild_id, messages);
}

module.exports = {
	checkCommand: function(contentMessage) {
		const command = contentMessage.command;
		const filterType = command[1];
		const filter = command.length > 2 ? command[2] : '';

		if (filter.includes('top')) {
			const number = parseInt(filter.substr('top'.length));
			if(!isNaN(number)) {
				if (filterType === 'all' || filterType === 'attack' || filterType === 'defense') {
					getKillTribeList(contentMessage, filterType, number);
				}
			}
		}
	}
}
