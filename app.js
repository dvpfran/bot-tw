const express = require('express');
const readline = require('readline');
const config = require('config');

const Gateway = require('./config/Gateway');
const Webhook = require('./config/Webhook');
const { TribalWarsInfoType, GatewayOPCodes  } = require('./config/Enums');
const Command = require('./commands/Command');
const WorldSettings = require('./commands/World_Settings');
const WorldBuildings = require('./commands/World_Buildings');
const WorldUnits = require('./commands/World_Units');
const Player = require('./commands/Player');
const Ally = require('./commands/Ally');
const TribalWars = require('./TribalWars/TribalWars');
const Villages = require('./TribalWars/Villages');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', (input) => {
	Command.checkCommand(input);
});

var app = express();

app.listen(3000, () => {
    console.log(`Server running on port 3000\n[DEBUG MODE]: ${config.get('debugMode')}`);

	Gateway.initialize();

	TribalWars.getInfo(TribalWarsInfoType.WORLD, 'xml').then((result) => {
		WorldSettings.loadInfo(result.config);

		TribalWars.getInfo(TribalWarsInfoType.BUILDINGS, 'xml').then((result) => {
			WorldBuildings.loadInfo(result.config);

			TribalWars.getInfo(TribalWarsInfoType.UNITS, 'xml').then((result) => {
				WorldUnits.loadInfo(result.config);
	
				TribalWars.getInfo(TribalWarsInfoType.PLAYER).then((result) => {
					Player.fillList(result);

					TribalWars.getInfo(TribalWarsInfoType.ALLY).then((result) => {
						Ally.fillList(result);

						TribalWars.getInfo(TribalWarsInfoType.VILLAGE).then((result) => {
						Villages.getVillages(result);
							
							TribalWars.getInfo(TribalWarsInfoType.CONQUER).then((result) => {
								TribalWars.getConquers(result);
							});
						});
					});
				});
			});
		});
	});
});
