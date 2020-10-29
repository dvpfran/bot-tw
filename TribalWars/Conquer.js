const Webhook = require('../config/Webhook');
const TribalWars = require('./TribalWars');
const { TribalWarsInfoType } = require('../config/Enums');
const Player = require('../commands/Player');
const Villages = require('./Villages');

class Conquer {
	constructor(village_id, unix_timestamp, new_owner, old_owner) {
		this.village_id = village_id;
		this.date_string = this.convertTimeStampToDate(unix_timestamp);
		this.hours_string = this.convertTimeStampToHours(unix_timestamp);
		this.unix_timestamp = unix_timestamp; 
		this.new_owner = new_owner;
		this.old_owner = old_owner;
	}

	convertTimeStampToHours(timestamp) {
		const date = new Date(timestamp * 1000);
		const hours = '0' + date.getHours();
		const minutes = '0' + date.getMinutes();
		const seconds = '0' + date.getSeconds();
		return `${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
	}

	convertTimeStampToDate(timestamp) {
		const today = new Date(timestamp * 1000);
		return new Date(today.getFullYear(), today.getMonth(), today.getDate());
	}
}

let listConquers = [];

function getConquers(result) {
	for(let index = 0; index < result.length; index++) {
		if (result[index] !== '') {
			const item = result[index].split(',');
			if (listConquers.length === 0 || listConquers[listConquers.length - 1].unix_timestamp < item[1]) {
				const new_owner = Player.getName(item[2]);
				const old_owner = Player.getName(item[3]);
				const village_name = Villages.getName(item[0]);
				listConquers.push(new Conquer(village_name, parseInt(item[1]), new_owner, old_owner));
			}
		}
	}
}

module.exports.getConquers = getConquers;
module.exports.checkNewConquers = checkNewConquers;
module.exports.listConquers = listConquers;
