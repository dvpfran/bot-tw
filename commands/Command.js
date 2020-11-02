const fetch = require('node-fetch');

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
		case 'settings':
			Settings.checkCommand(contentMessage);
			break;
		case 'help':
			Help.sendHelp(contentMessage);
			break;
    }
}

module.exports = {
    checkCommand: function(content) {
        checkCommandType(content);
    },
}
