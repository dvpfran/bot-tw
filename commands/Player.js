const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
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
	sendPlayers(number, listTopVillages);
}

function getTopRank(number) {
	sortPlayers(SortType.RANK);
	let listTopRank = [];
	for(let index = 0; index < number; index++) {
		listTopRank.push(generateArrayPlayer(listPlayers[index]));
     }
    sendPlayers(number, listTopRank);
}

function getPlayer(player) {
	sendPlayers(1, [generateArrayPlayer(player)]); 
}

function generateArrayPlayer(player) {
	let list = [player.rank, player.points, player.villages, player.name];
	return list;
}

function sendPlayers(count, players) {
	Table.setInfoTable(players, ['Rank', 'Pontos', 'Aldeias', 'Nome']);
	players = '```'+ Table.generateTable() + '```\n';
	players = `**Número de Jogadores: ${count}**\n${players}`;
	
    Webhook.sendMessage(players);
}

function getName(id) {
	const player = listPlayers.find(player => player.id === id);
	if (player !== undefined) {
		return player.name;
	}
	return undefined;
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
    checkCommand: function(args) {
		const filterType = args[0];
        const filter = args[1];

        if (filter.includes('top')) {
            const number = parseInt(filter.substr('top'.length));
            if (filterType === 'villages') {
                getTopVillage(number);
            }
            else if (filterType === 'rank') {
                getTopRank(number);
            }
        }
		else {
			const player_name = args.toString().replace(',', ' ');
			const player = listPlayers.find(player => player.name.toLowerCase() === player_name.toLowerCase());
			if (player !== undefined) {
				getPlayer(player);
			}
		}
    }
}

module.exports.getName = getName;
