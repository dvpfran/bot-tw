const fetch = require('node-fetch');

const Player = require('./Player');
const Help = require('./Help');
const Conquer = require('./Conquer');
const Kill = require('./Kill');

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
