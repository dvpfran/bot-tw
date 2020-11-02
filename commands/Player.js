const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Player {
    constructor(id, name, tribe_id, villages, points, rank) {
        this.id = id;
        this.name = name;
        this.tribe_id = tribe_id;
        this.villages = villages;
        this.points = points;
        this.rank = rank;
    }
}

const SortType = {
    RANK: 0,
    VILLAGES: 1,
};

let listPlayers = [];

function sortPlayers(sortType) {
    switch(sortType) {
        case SortType.RANK:
            listPlayers.sort((a, b) => {
				return a.rank - b.rank;
            });
            break;
        case SortType.VILLAGES:
            listPlayers.sort((a, b) => {
                return b.villages - a.villages;
            });
            break;
    }
}

function getTopVillage(number) {
	sortPlayers(SortType.VILLAGES);
	let listTopVillages = [];
    for(let index = 0; index < number; index++) {
		listTopVillages.push(generateArrayPlayer(listPlayers[index]));
    }
	return listTopVillages;
}

function getTopRank(number) {
	sortPlayers(SortType.RANK);
	let listTopRank = [];
	for(let index = 0; index < number; index++) {
		listTopRank.push(generateArrayPlayer(listPlayers[index]));
    }
   	return listTopRank;
}

function generateArrayPlayer(player) {
	let list = [player.rank, formatNumber(player.points), player.villages, player.name];
	return list;
}

function sendPlayers(channel_id, guild_id, players) {
	Table.setInfoTable(players, ['Rank', 'Pontos', 'Aldeias', 'Nome']);

	var splitedTable = Table.generateTable();

	let messages = [];	
	messages.push(`**Número de Jogadores: ${players.length}**`);
	
	for(let index = 0; index < splitedTable.length; index++) {
		messages.push('```'+ splitedTable[index] + '```');
	}
	Message.send(channel_id, guild_id, messages);
}

function getName(id) {
	const player = listPlayers.find(player => player.id === id);
	if (player !== undefined) {
		return player.name;
	}
	return undefined;
}

function getPlayerByName(name) {
	return listPlayers.find(player => player.name.toLowerCase() === name.toLowerCase());
}

module.exports = {
    fillList: function(result) {
    	for(let index = 0; index < result.length; index++) {
            const item = result[index].split(',');
			if (item) {
	        	listPlayers.push(new Player(item[0], item[1], parseInt(item[2]), parseInt(item[3]), parseFloat(item[4]), parseInt(item[5])));
			}
    	}
    },
    checkCommand: function(contentMessage) {
		const command = contentMessage.command;
		const filterType = command[1];
        const filter = command.length > 2 ? command[2] : '';

		let listToSend = [];
        if (filter.includes('top')) {
            const number = parseInt(filter.substr('top'.length));

            if (filterType === 'villages') {
                listToSend = getTopVillage(number);
            }
            else if (filterType === 'rank') {
                listToSend = getTopRank(number);
            }
        }
		else {
			const player_name = filterType.toString().replace(',', ' ');
			const player = getPlayerByName(player_name);
			if (player !== undefined) {
				listToSend.push(generateArrayPlayer(player));
			}
		}
		if(listToSend.length > 0) {
			sendPlayers(contentMessage.channel_id, contentMessage.guild_id, listToSend);
		}
    }
}

module.exports.getName = getName;
module.exports.getPlayerByName = getPlayerByName;
