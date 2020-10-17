const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes  } = require('../config/Enums');

let worldSettings = undefined;

function checkCommand() {
	prepareMessage();
}

function prepareMessage() {
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
	listToSend.push(['Arqueiros', getEnableString(worldSettings.game.archers)]);
	
	Table.setInfoTable(listToSend, ['Descrição', 'Valores']);
	
	let messageGame = `**Configurações Mundo ??**\n`;
	messageGame += '```'+ Table.generateTable() + '```\n';

	listToSend = [];
	listToSend.push(['Comprado com', worldSettings.snob.gold]);
	listToSend.push(['Distância máxima', worldSettings.snob.max_dist]);
	listToSend.push(['Aumenta lealdade por hora', worldSettings.snob.rise]);

	Table.setInfoTable(listToSend, ['Descrição', 'Valores']);	

	let messageSnob = `**Nobre**\n`;
	messageSnob += '```'+ Table.generateTable() + '```\n';

	listToSend = [];
	listToSend.push(['Limite de membros tribo', worldSettings.ally.limit]);
	listToSend.push(['Níveis da tribo', getEnableString(worldSettings.ally.levels)]);

	Table.setInfoTable(listToSend, ['Descrição', 'Valores']);
	let messageConfig = `**Configuração**\n`;
	messageConfig += '```'+ Table.generateTable() + '```';
	
	sendMessage(messageGame).then(sendMessage(messageSnob).then(sendMessage(messageConfig)));
}

function getEnableString(value) {
	return value == 1 ? 'Ativo' : 'Inativo';
}

function sendMessage(message) {
	return new Promise((resolve) => {
		setTimeout(() => {
			Webhook.sendMessage(message);
			resolve();
		}, 800);
	});
}

module.exports = {
	loadInfo: function() {
		TribalWars.getInfo(TribalWarsInfoType.WORLD, 'xml').then((result) => {
			worldSettings = result.config;
		});
	},
}

module.exports.checkCommand = checkCommand;
