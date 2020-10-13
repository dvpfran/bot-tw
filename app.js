const express = require('express');

const Gateway = require('./config/Gateway');
const Command = require('./commands/Command');
const Player = require('./commands/Player');
const TribalWars = require('./TribalWars/TribalWars');

var app = express();

app.listen(3000, () => {
    console.log('Server running on port 3000');
    Gateway.initialize();

    Player.fillList();
	TribalWars.getConquers();
	TribalWars.checkNewConquers();
});
