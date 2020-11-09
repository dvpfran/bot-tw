const fetch = require('node-fetch');

const app_info = require('../app_info');
const Message = require('../config/Message');
const Settings = require('./Settings');
const WorldSettings = require('./World_Settings');
const WorldBuildings = require('./World_Buildings');
const WorldUnits = require('./World_Units');
const Player = require('./Player');
const Ally = require('./Ally');
const Help = require('./Help');
const Conquer = require('./Conquer');
const Kill = require('./Kill');
const KillTribe = require('./Kill_Tribe');

function checkCommandType(contentMessage) {
	contentMessage.command = contentMessage.command.split(' ');
	const commandType = contentMessage.command[0].substring(1);

	if(app_info.isValidChannel(contentMessage.channel_id) && commandType !== 'list' || commandType === 'set') {    
		switch(commandType) {
			case 'player':
				Player.checkCommand(contentMessage);
				break;
			case 'ally':
				Ally.checkCommand(contentMessage);
				break;
			case 'kill':
				Kill.checkCommand(contentMessage);
				break;
			case 'kill_ally':
				KillTribe.checkCommand(contentMessage);
				break;
			case 'conquer':
				Conquer.checkCommand(contentMessage);
				break;
			case 'world':
				const commandParam = contentMessage.command[1];
				switch(commandParam) {
					case 'settings':
						WorldSettings.checkCommand(contentMessage);
						break;
					case 'buildings':
						WorldBuildings.checkCommand(contentMessage);
						break;
					case 'units':
						WorldUnits.checkCommand(contentMessage);
						break;
				}
				break;
			case 'set':
				Settings.checkCommand(contentMessage);
				break;
			case 'help':
				Help.sendHelp(contentMessage);
				break;
    	}
	}
	else {
		if(contentMessage.command.length === 2) {
			if(commandType === 'list') {
				const commandParam = contentMessage.command[1].toLowerCase();
				if(commandParam === 'servers' || commandParam === 'languages') {
					app_info.sendInfo(contentMessage.channel_id, commandParam);
				}
			}
		}
		else {
			let message = "You need to set a **server**, **world** and **language** first:\n";
				
			message += "```1º - execute the command: !list servers\n";
			message += "2º - execute the command: !set server [server number]\n";
			message += "3º - execute the command: !set world [world number]\n";
			message += "4º - execute the command: !list languages\n";
			message += "5º - execute the command: !set language [language number]\n```";

			Message.send(contentMessage.channel_id, 0, [message]);
		}
	}
}

module.exports = {
    checkCommand: function(content) {
        checkCommandType(content);
    },
}
