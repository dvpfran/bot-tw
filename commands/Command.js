const fetch = require('node-fetch');

const Player = require('./Player');
const Help = require('./Help');

function checkCommandType(content) {
    // 'player', 'points top5'
    content = content.split(' ');

    if (content.length >= 3) {
        const commandType = content[0].substring(1);
        const args = [content[1], content[2]];
    
        switch(commandType) {
            case 'player':
                Player.checkCommand(args);
                break;
        }
    }
	else if (content.length <= 1 && content[0] == '!help') {
		Help.sendHelp();
	}
}

function get() {
    fetchRequest();
}

function send() {
    fetchRequest();
}

function fetchRequest() {
    
}

module.exports = {
    checkCommand: function(content) {
        checkCommandType(content);
    },
    getCommand: function() {
        get();
    },
    sendCommand: function() {
        send();
    },
}
