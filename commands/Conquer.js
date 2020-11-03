const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Conquer = require('../TribalWars/Conquer');

let listConquers = null;

function checkCommand(contentMessage) {
	const command = contentMessage.command;
	const filter = command.length > 2 ? command.splice(1, 2).toString() : command[1];


	if(filter !== undefined) {
		listConquers = Conquer.listConquers;
		let listToSend = [];
		if (filter == 'today') {
			listToSend = getSpecificDateConquers(new Date());
		}
		else if (filter == 'last') {
			listToSend = getLastConquers();
		}
		else if (filter.includes('last')) {
			const countConquers = filter.substring('last'.length);
			if (!isNaN(countConquers)) {
				listToSend = getLastConquers(countConquers);
			}
		}
		else {
			const dateConquer = convertToValidDate(filter);
			if (dateConquer != 'Invalid Date' && dateConquer != null && !isNaN(new Date(dateConquer))) {
				listToSend = getSpecificDateConquers(dateConquer);
			}
			else {
				const player_name = filter.toString().replace(',', ' ');
			}
		}
		if(listToSend.length > 0) {
			sendConquers(contentMessage.channel_id, contentMessage.guild_id, listToSend);
		}	
	}
}

function convertToValidDate(type) {
	let splitDate = null;
	let date = null;

	if (type.includes('-')) { 
		splitDate = type.split('-');			
	} 
	else if (type.includes('/')) {
		splitDate = type.split('/');
	}

	if (splitDate != null) {
		date = new Date(`${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`);
	}
	return date;
}

function getSpecificDateConquers(specificDate) {
	let listDateConquers = [];
	for(let index = 0; index < listConquers.length; index++) {
		if (listConquers[index].date_string.getFullYear() == specificDate.getFullYear() && listConquers[index].date_string.getMonth() == specificDate.getMonth() && listConquers[index].date_string.getDate() == specificDate.getDate()) {
			listDateConquers.push(listConquers[index]);
		}
	}
	return prepareConquersToSend(listDateConquers);
} 

function getLastConquers(count = 1) {
	let listLastConquers = [];
	const conquersLength = listConquers.length - 1;
	for(let index = conquersLength; index > conquersLength - count; index--) {
		listLastConquers.push(listConquers[index]);
	}
	return prepareConquersToSend(listLastConquers);
}

function getPlayerConquers(name) {
	let listPlayerConquers = listConquers.filter(conquer => conquer.new_owner !== undefined && conquer.new_owner.toLowerCase() === name.toLowerCase());
	return prepareConquersToSend(listPlayerConquers);
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

	if(listConquers.length > 0) {
		listMessages.push(`**Número de Conquistas: ${listConquers.length}**\n`);
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
	}
	return listMessages;
}

function sendConquers(channel_id, guild_id, messages) {
	let listMessages = [];
	messages.map((message, index) => {
		if(index !== 0) {
			listMessages.push('```'+ message +'```')
		}
		else {
			listMessages.push(message);
		}
	});
	Message.send(channel_id, guild_id, listMessages);	
}

module.exports.checkCommand = checkCommand;
