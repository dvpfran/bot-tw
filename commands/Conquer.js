const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Conquer = require('../TribalWars/Conquer');

let listConquers = null;

function checkCommand(type) {
	listConquers = Conquer.listConquers;
	if (type == 'today') {
		getSpecificDateConquers(new Date());
	}
	else if (type == 'last') {
		getLastConquers();
	}
	else if (type.includes('last')) {
		const countConquers = type.substring('last'.length);
		if (!isNaN(countConquers)) {
			getLastConquers(countConquers);
		}
	}
	else {
		let splitDate = null;

		if (type.includes('-')) { 
			splitDate = type.split('-');			
		} 
		else if (type.includes('/')) {
			splitDate = type.split('/');
		}

		if (splitDate != null) {
			const date = new Date(`${splitDate[0]}/${splitDate[1]}/${splitDate[2]}`);

			if (date != 'Invalid Date' && !isNaN(new Date(date))) {
				getSpecificDateConquers(date);
			}
		}	
	}
}

function getSpecificDateConquers(specificDate) {
	let todayConquers = '';
	let countConquers = 0;

	for(let index = 0; index < listConquers.length; index++) {
		if (listConquers[index].date_string.getFullYear() == specificDate.getFullYear() && listConquers[index].date_string.getMonth() == specificDate.getMonth() && listConquers[index].date_string.getDate() == specificDate.getDate()) {
			todayConquers += generateStringConquer(listConquers[index]);
			countConquers++;
		}
	}
	sendConquers(countConquers, todayConquers);
} 

function getLastConquers(count = 0) {
	let lastConquers = '';
	let countConquers = 0;
	const conquersLength = listConquers.length - 1;

	for(let index = conquersLength; index > (conquersLength - count); index--) {
		lastConquers += generateStringConquer(listConquers[index]);
		countConquers++;
	}
	sendConquers(countConquers, lastConquers);
}

function generateStringConquer(conquer) {
	let message = `- ${conquer.new_owner} conquistou ${conquer.village_id}`;
	let countConquers = 0;
	if (conquer.old_owner != 0) {
		 message += ` de ${conquer.old_owner}`;
	}
	return message + '\n';
}

function sendConquers(count, conquers) {
	conquers = '```' + conquers + '```';
	conquers = `**Número de Conquistas: ${count}**\n${conquers}`;
	Webhook.sendMessage(conquers.substring(0, 2000));	
}

module.exports.checkCommand = checkCommand;
