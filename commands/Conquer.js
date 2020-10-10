const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Conquer = require('../TribalWars/Conquer');

let listConquers = null;

function checkCommand(type) {
	listConquers = Conquer.listConquers;
	if (type == 'today') {
		getTodayConquers();
	}
	else if (type == 'last') {
		getLastConquers();
	}
	else if (type.includes('last')) {
		const countConquers = type.substring('last'.length - 1);
		if (!isNaN(countConquers)) {
			getLastConquers(countConquers);
		}
	}
}

function getTodayConquers() {
	const today = new Date();

	let todayConquers = ''; 

	for(let index = 0; index < listConquers.length; index++) {
		if (listConquers[index].date_string.getFullYear() == today.getFullYear() && listConquers[index].date_string.getMonth() == today.getMonth() && listConquers[index].date_string.getDate() == today.getDate()) {
			todayConquers += `${listConquers[index].new_owner} conquistou ${listConquers[index].old_owner}\n`;
		}
	}
	
	Webhook.sendMessage(todayConquers.substring(0, 2000));	
} 

function getLastConquers(count = 0) {
	
}

function getSpecificDateConquers() {

}

module.exports.checkCommand = checkCommand;
