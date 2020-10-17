const fetch = require('node-fetch');

const WorldSettings = require('./World_Settings');
const WorldBuildings = require('./World_Buildings');
const Player = require('./Player');
const Help = require('./Help');
const Conquer = require('./Conquer');
const Kill = require('./Kill');
const KillTribe = require('./Kill_Tribe');

function checkCommandType(content) {
    content = content.split(' ');
    if (content.length >= 3) {
        const commandType = content[0].substring(1);
        const args = [content[1], content[2]];
    
        switch(commandType) {
            case 'player':
                Player.checkCommand(args);
                break;
			case 'kill':
				Kill.checkCommand(args);
				break;
			case 'kill_tribe':
				KillTribe.checkCommand(args);
				break;
			case 'world':
				WorldBuildings.checkCommand(args);
				break;
        }
    }
	else if (content.length == 2 && content[0] == '!world') {
		if (content[1] === 'settings') {
			WorldSettings.checkCommand(content[1]);
		}
		else if (content[1] === 'buildings') {
			WorldBuildings.checkCommand(content[1]);
		}
	}
	else if (content.length == 2 && content[0] == '!conquer') {
		Conquer.checkCommand(content[1]);
	}
	else if (content.length <= 1 && content[0] == '!help') {
		Help.sendHelp();
	}
}

module.exports = {
    checkCommand: function(content) {
        checkCommandType(content);
    },
}
