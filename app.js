const express = require('express');

const Gateway = require('./config/Gateway');
const Command = require('./commands/Command');
const WorldSettings = require('./commands/World_Settings');
const Player = require('./commands/Player');
const TribalWars = require('./TribalWars/TribalWars');

var app = express();

app.listen(3000, () => {
    console.log('Server running on port 3000');
    Gateway.initialize();

	WorldSettings.loadInfo();
    Player.fillList();
	TribalWars.getConquers();
	TribalWars.checkNewConquers();
});
