const Webhook = require('../config/Webhook');
const TribalWars = require('../TribalWars/TribalWars');
const { TribalWarsInfoType } = require('../config/Enums');
const Player = require('../commands/Player');

class Village {
	constructor(id, name, x, y, player_id, points) {
		this.id = id;
		this.name = name;
		this.x = x;
		this.y = y;
		this.player_id = player_id;
		this.points = points;
	}
}

let listVillages = [];

function getVillages(result) {
	listVillages = [];
	for(let index = 0; index < result.length; index++) {
		if (result[index] !== '') {
			const item = result[index].split(',');
			listVillages.push(new Village(item[0], item[1], item[2], item[3], item[4], item[5]));
		}
	}
}

function getName(id) {
	let village = listVillages.find(village => village.id == id);
	if (village !== undefined) {
		return `${village.name} - ${village.x}|${village.y}`;
	}
	return undefined;
}

module.exports.getVillages = getVillages;
module.exports.getName = getName;
