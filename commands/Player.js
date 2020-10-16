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
    POINTS: 1,
    VILLAGES: 2,
};

let listPlayers = [];
let lastSort = SortType.RANK; // sort rank by default

function sortPlayers(sortType) {
    switch(sortType) {
        case SortType.POINTS:
            listPlayers.sort((a, b) => {
                return b.points - a.points;
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
    lastSort !== SortType.VILLAGES && sortPlayers(SortType.VILLAGES);
    lastSort = SortType.VILLAGES;
	let listTopVillages = [];
    for(let index = 0; index < number; index++) {
		listTopVillages.push(generateArrayPlayer(listPlayers[index]));
    }
	sendPlayers(number, listTopVillages);
}

function getTopPoints(number) {
    lastSort !== SortType.POINTS && sortPlayers(SortType.POINTS);
    lastSort = SortType.POINTS;
	let listTopPoints = [];
	for(let index = 0; index < number; index++) {
		listTopPoints.push(generateArrayPlayer(listPlayers[index]));
     }
    sendPlayers(number, listTopPoints);
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

function getName(name) {

}

module.exports = {
    fillList: function() {
        TribalWars.getInfo(TribalWarsInfoType.PLAYER).then((result) => { 
            for(let index = 0; index < result.length; index++) {
                const item = result[index].split(',');
				if (item) {
	                listPlayers.push(new Player(item[0], item[1], parseInt(item[2]), parseInt(item[3]), parseFloat(item[4]), parseInt(item[5])));
				}
            }
        });           
    },
    checkCommand: function(args) {
        console.log('args:', args);
        const filterType = args[0];
        const filter = args[1];

        if (filter.includes('top')) {
            const number = parseInt(filter.substr('top'.length));
            if (filterType === 'villages') {
                getTopVillage(number);
            }
            else if (filterType === 'points') {
                getTopPoints(number);
            }
        }
        else if (filterType === 'name') {
            getName(filter);
        }
    }
}
