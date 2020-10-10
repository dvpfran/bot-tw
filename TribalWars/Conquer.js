const Webhook = require('../config/Webhook');
const TribalWars = require('../TribalWars/TribalWars');
const { TribalWarsInfoType } = require('../config/Enums');

class Conquer {
	constructor(village_id, unix_timestamp, new_owner, old_owner) {
		this.village_id = village_id;
		this.date_string = this.convertTimeStampToDate(unix_timestamp);
		this.unix_timestamp = unix_timestamp; 
		this.new_owner = new_owner;
		this.old_owner = old_owner;
	}

	convertTimeStampToDate(timestamp) {
		const date = new Date(timestamp * 1000);
		const hours = '0' + date.getHours();
		const minutes = '0' + date.getMinutes();
		const seconds = '0' + date.getSeconds();
		return `${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
	}
}

let listConquers = [];

function getConquers() {
	TribalWars.getInfo(TribalWarsInfoType.CONQUER).then((result) => {
		for(let index = 0; index < result.length; index++) {
			if (result[index] !== '') {
				const item = result[index].split(',');
				if (listConquers.length === 0 || listConquers[listConquers.length - 1].unix_timestamp < item[1]) {
					listConquers.push(new Conquer(parseInt(item[0]), parseInt(item[1]), parseInt(item[2]), parseInt(item[3])));
					console.log(listConquers[listConquers.length - 1]);
				}
			}
		}
	});
}

function checkNewConquers() {
	setInterval(() => {
		console.log('Verificar novas conquistas');
		getConquers();
	}, 30000);
}

module.exports.getConquers = getConquers;
module.exports.checkNewConquers = checkNewConquers;
