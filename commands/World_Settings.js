const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes  } = require('../config/Enums');

let worldSettings = undefined;

function checkCommand() {
	sendMessage();
}

function sendMessage() {
	let listToSend = [];

	listToSend.push(['Velocidade do jogo', worldSettings.speed]);
	listToSend.push(['Velocidade das unidades', worldSettings.unit_speed]);
	listToSend.push(['Demolir edifício', getEnableString(worldSettings.build.destroy)]);
	listToSend.push(['Moral', worldSettings.moral]);
	listToSend.push(['Igreja', getEnableString(worldSettings.game.church)]);
	listToSend.push(['Torre de vigia', getEnableString(worldSettings.game.watchtower)]);
	listToSend.push(['Pontos Aldeias Bárbaras', worldSettings.game.barbarian_max_points]);
	listToSend.push(['Tempo para cancelar ataques', worldSettings.commands.command_cancel_time]);
	listToSend.push(['Tempo para cancelar transportes de mercado', worldSettings.misc.trade_cancel_time]);
	listToSend.push(['Bónus Noturno', `${worldSettings.night.start_hour} às ${worldSettings.night.end_hour}`]);
	listToSend.push(['Proteção de novatos', `${worldSettings.newbie.days} dias`]);

	Table.setInfoTable(listToSend, ['Descrição', 'Valores']);
	
	let message = `**Configurações Mundo ??**\n`;
	message += '```'+ Table.generateTable() + '```\n';
	Webhook.sendMessage(message);
}

function getEnableString(value) {
	return value == 1 ? 'Ativo' : 'Inativo';
}

module.exports = {
	loadInfo: function() {
		TribalWars.getInfo(TribalWarsInfoType.WORLD, 'xml').then((result) => {
			worldSettings = result.config;
		});
	},
}

module.exports.checkCommand = checkCommand;
