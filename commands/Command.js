const fetch = require('node-fetch');

const Player = require('./Player');

function checkCommandType(commandType, args) {
    switch(commandType) {
        case 'player':
            Player.checkCommand(args);
            break;
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
    checkCommand: function() {
        checkCommandType('player', 'points top5');
    },
    getCommand: function() {
        get();
    },
    sendCommand: function() {
        send();
    },
}