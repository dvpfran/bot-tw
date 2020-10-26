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
		const dateConquer = convertToValidDate(type);	
		if (dateConquer != 'Invalid Date' && dateConquer != null && !isNaN(new Date(dateConquer))) {
			getSpecificDateConquers(dateConquer);
		}
		else {
			const player_name = type.toString().replace(',', ' ');	
			getPlayerConquers(player_name);
		}
	}
}

function convertToValidDate(type) {
	let splitDate = null;
	if (type.includes('-')) { 
		splitDate = type.split('-');			
	} 
	else if (type.includes('/')) {
		splitDate = type.split('/');
	}

	if (splitDate != null) {
		const date = new Date(`${splitDate[0]}/${splitDate[1]}/${splitDate[2]}`);
	}
	return splitDate;
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
	let listLastConquers = [];
	const conquersLength = listConquers.length - 1;
	for(let index = conquersLength; index > conquersLength - count; index--) {
		listLastConquers.push(listConquers[index]);
	}
	const messages = prepareConquersToSend(listLastConquers);	
	sendConquers(listLastConquers.length, messages);
}

function getPlayerConquers(name) {
	let listPlayerConquers = listConquers.filter(conquer => conquer.new_owner !== undefined && conquer.new_owner.toLowerCase() === name.toLowerCase());
	const messages = prepareConquersToSend(listPlayerConquers);
	sendConquers(listPlayerConquers.length, messages);
}

function generateStringConquer(conquer) {
	let message = `- ${conquer.new_owner} conquistou ${conquer.village_id}`;
	let countConquers = 0;
	if (conquer.old_owner !== undefined) {
		 message += ` de ${conquer.old_owner}`;
	}
	return message + '\n';
}

function prepareConquersToSend(listConquers) {
	let listMessages = [];
	let contentMessage = '';

	listConquers.map((conquer, index = 0) => {
		let generatedString = generateStringConquer(conquer);
		if (contentMessage.length + generatedString.length >= 1800) {
			listMessages.push(contentMessage);
			contentMessage = generatedString;
		}
		else {
			contentMessage += generatedString;
			if (index + 1 === listConquers.length) {
				listMessages.push(contentMessage);
			}
		}
	});
	return listMessages;
}

function sendConquers(count, messages) {
	let listMessages = [`**Número de Conquistas: ${count}**\n`];
	messages.map(message => listMessages.push('```'+ message +'```'));
	Webhook.sendMessage(listMessages);	
}

module.exports.checkCommand = checkCommand;
