const express = require('express');
const readline = require('readline');
const config = require('config');

const Gateway = require('./config/Gateway');
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

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
	.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
	.listen(PORT, () => {
		console.log(`Server running on port ${PORT}\n[DEBUG MODE]: ${config.get('debugMode')}`);

		Gateway.initialize();
		loadData();
		timerRefreshData();
	});

function loadData() {
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
}

function timerRefreshData() {
	setInterval(() => {
		loadData();
	}, 600000);
}
