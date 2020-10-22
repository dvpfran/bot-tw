const Webhook = require('../config/Webhook');
const TribalWars = require('../TribalWars/TribalWars');
const { formatNumber } = require('../tools/geralFunctions');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Ally {
	constructor(id, name, tag, members, villages, points, all_points, rank) {
		this.id = id;
		this.name = name;
		this.tag = tag;
		this.members = members;
		this.villages = villages;
		this.points = points;
		this.all_points = all_points;
		this.rank = rank;
	} 
}

const SortType = {
	RANK: 0,
	VILLAGES: 1,
	MEMBERS: 2,
};

let listAllies = [];

function fillList(result) {
	for(let index = 0; index < result.length; index++) {
		const item = result[index].split(',');
		if (item) {
			listAllies.push(new Ally(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]));
		}
	}
}

function checkCommand(args) {
	const filterType = args[0];
    const filter = args[1];

    if (filter.includes('top')) {
    	const number = parseInt(filter.substr('top'.length));
        if (filterType === 'villages') {
        	getTopList(number, SortType.VILLAGES);
        }
        else if (filterType === 'rank') {
        	getTopList(number, SortType.RANK);
        }
		else if (filterType === 'members') {
			getTopList(number, SortType.MEMBERS);
		}
    }
}

function getTopList(number, sortType) {
	sortAllies(sortType);
	
	let listTop = [];
	for(index = 0; index < number; index++) {
		const ally = listAllies[index];
		listTop.push([ally.rank, ally.name, formatNumber(ally.points), ally.members, ally.villages]);
	}
	sendAllies(listTop);
}

function sortAllies(type) {
	listAllies.sort((a, b) => {
		switch(type) {
			case SortType.RANK:
				return a.rank - b.rank;
				break;
			case SortType.VILLAGES:
				return b.villages - a.villages;
				break;
			case SortType.MEMBERS:
				return b.members - a.members
				break;
		}
	});
}

function getName(id) {
	let ally = listAllies.find(ally => ally.id == id);
	if (ally !== undefined) {
		return ally.name;
	}
	return undefined;
}

function sendAllies(listTop) {
	let message = '';
	Table.setInfoTable(listTop, ['Rank', 'Nome', 'Pontos', 'Membros', 'Aldeias']);
	message = `**Números de Tribos: ${listTop.length}\n`;
	message += '```'+ Table.generateTable() +'```';
	Webhook.sendMessage(message);
}

module.exports.fillList = fillList;
module.exports.checkCommand = checkCommand;
module.exports.getName = getName;