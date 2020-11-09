const fetch = require('node-fetch');

const database = require('./config/Database');
const Message = require('./config/Message');

var listChannels = [];
let listLanguages;
let listServers;

function initialize() {
	fillChannels();
	fillLanguages();
	fillServers();
}

function fillChannels() {
	database.query("SELECT cnl.channel_id, srv.name, srv.tag, stg.world FROM channels cnl "+
					"LEFT JOIN settings stg ON stg.channel_id = cnl.channel_id "+
					"LEFT JOIN servers srv ON srv.id = stg.server_id "+
					"LEFT JOIN languages lng ON lng.id = stg.language_id;")
	.then(result => {
		console.log('resultado:', result);
		listChannels = result;
	});
}

function fillLanguages() {
	database.query("SELECT * FROM languages WHERE enable = '1';")
	.then(result => {
		listLanguages = result;
	});
}

function fillServers() {
	database.query("SELECT * FROM servers WHERE enable = '1';")
	.then(result => {
		listServers = result;
	});	
}

function checkChannel(channel_id) {
	console.log('tamanho:', listChannels.length)
	if(listChannels.length == 0 || !listChannels.find(item => item.channel_id == channel_id)) {
		database.query("INSERT INTO channels (channel_id) VALUES ($1);", [channel_id])
		.then(result => {
			if(result.length === 0) {
				listChannels.push({id: 'channel_id', server: '', language: '', world: ''});
			}
		});
	}
}

function isValidChannel(channel_id) {
	let valid = false;
	if(listChannels.length > 0) {
		const channel = listChannels.filter(item => item.channel_id == channel_id)[0];
		if(channel !== undefined) {
			if(channel.server !== null && channel.language !== null && channel.world !== null) {
				valid = true;
			}
		}
	}
	return valid;
}

function isValidServer(server_id) {
	return listServers.find(item => item.id == server_id);
}

function isValidWorld(channel_id, world) {		
	const serverChannel = getChannel(channel_id);

	if(serverChannel !== undefined && serverChannel !== null) {
		return new Promise(resolve => {
			fetch(`https://${serverChannel.tag}${world}.${serverChannel.name}/page/stats`, {
				'method': 'GET'
			})
			.then(response => {
				resolve(response.statusText == 'OK' ? true : false);
			});
		});
	}
	else {
		// dar mensagem que primeiro é preciso definir o server
		return false;
	}
}

function isValidLanguage(language_id) {
	listLanguages.find(item => item.id == language_id);
}

function sendInfo(channel_id, param) {
	let message = `**List of ${param}:\n**`;
	let listToSend = param === 'servers' ? listServers : listLanguages;
	message += "```";

	for(let index = 0; index < listToSend.length; index++) {
		message += `${listToSend[index].id} - ${listToSend[index].name}\n`;
	}

	message += "```";
	Message.send(channel_id, 0, [message]);
}

function getChannel(channel_id) {
	console.log(listChannels);
	return listChannels.filter(item => item.channel_id == channel_id)[0];
} 

module.exports.initialize = initialize;
module.exports.checkChannel = checkChannel;
module.exports.isValidChannel = isValidChannel;
module.exports.isValidServer = isValidServer;
module.exports.isValidWorld = isValidWorld;
module.exports.isValidLanguage = isValidLanguage;
module.exports.sendInfo = sendInfo;
module.exports.getChannel = getChannel;
