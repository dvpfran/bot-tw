const express = require('express');
const readline = require('readline');
const config = require('config');

const Gateway = require('./config/Gateway');
const Webhook = require('./config/Webhook');
const Command = require('./commands/Command');
const WorldSettings = require('./commands/World_Settings');
const WorldBuildings = require('./commands/World_Buildings');
const WorldUnits = require('./commands/World_Units');
const Player = require('./commands/Player');
const TribalWars = require('./TribalWars/TribalWars');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', (input) => {
	Command.checkCommand(input);
});

var app = express();

app.listen(3000, () => {
    console.log(`Server running on port 3000 - Debug Mode: ${config.get('debugMode')}`);

	Gateway.initialize();

	WorldSettings.loadInfo();
	WorldBuildings.loadInfo();
	WorldUnits.loadInfo();
    Player.fillList();
	TribalWars.getConquers();
	TribalWars.checkNewConquers();
});
