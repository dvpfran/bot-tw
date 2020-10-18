const express = require('express');

const Gateway = require('./config/Gateway');
const Command = require('./commands/Command');
const WorldSettings = require('./commands/World_Settings');
const WorldBuildings = require('./commands/World_Buildings');
const WorldUnits = require('./commands/World_Units');
const Player = require('./commands/Player');
const TribalWars = require('./TribalWars/TribalWars');

var app = express();

app.listen(3000, () => {
    console.log('Server running on port 3000');
    Gateway.initialize();

	WorldSettings.loadInfo();
	WorldBuildings.loadInfo();
	WorldUnits.loadInfo();
    Player.fillList();
	TribalWars.getConquers();
	TribalWars.checkNewConquers();
});
