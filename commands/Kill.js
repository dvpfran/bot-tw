const Message = require('../config/Message');
const Player = require('./Player');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');
const { language } = require('../languages/language');

class Kill {
	constructor(rank, id, player_name, score) {
		this.rank = rank;
		this.id = id;
		this.player_name = player_name;
		this.score = score;
	}
}

function getKillList(contentMessage, filterType, number) {
	let listKills = [];
	let infoType = null;
	switch(filterType) {
		case 'all':
			infoType = TribalWarsInfoType.KILL_ALL;
			break;
		case 'attack':
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
			listKills.sort((a, b) => {
				return a.rank - b.rank;
			});
		}).then(() => {
			let sortedList = [];
			for(let index = 0; index < number; index++) {
				sortedList.push([listKills[index].rank, listKills[index].player_name, formatNumber(listKills[index].score)]);
			}
			
			if(sortedList.length > 0) {
				sendKills(contentMessage.channel_id, contentMessage.guild_id, sortedList);
			}
		});		
	}
}

function sendKills(channel_id, guild_id, kills) {
	Table.setInfoTable(kills, [language.rank, language.name, language.defeated]);

	const splitedTable = Table.generateTable();
	const messages = [];

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
	
		if(filter.includes('top')) {
			const number = parseInt(filter.substr('top'.length));
			if(!isNaN(number)) {
				if (filterType === 'all' ||  filterType === 'attack' || filterType === 'defense') {
					getKillList(contentMessage, filterType, number);
				}
			}
		}
	}
}
