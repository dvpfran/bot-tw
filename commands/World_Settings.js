const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes  } = require('../config/Enums');
const { language } = require('../languages/language');

let worldSettings = undefined;

function checkCommand(contentMessage) {
	prepareMessage(contentMessage);
}

function prepareMessage(contentMessage) {
	let listToSend = [];

	const lang_units = language.units_obj;
	const lang_buildings = language.buildings_obj;
	const lang_settings = language.world_settings;

	listToSend.push([lang_settings.game_speed, worldSettings.speed]);
	listToSend.push([lang_settings.unit_speed, worldSettings.unit_speed]);
	listToSend.push([lang_settings.demolish_building, getEnableString(worldSettings.build.destroy)]);
	listToSend.push([lang_settings.morale, worldSettings.moral]);
	listToSend.push([lang_buildings.church, getEnableString(worldSettings.game.church)]);
	listToSend.push([lang_buildings.watchtower, getEnableString(worldSettings.game.watchtower)]);
	listToSend.push([lang_settings.barbarian_points, worldSettings.game.barbarian_max_points]);
	listToSend.push([lang_settings.time_cancel_attack, worldSettings.commands.command_cancel_time]);
	listToSend.push([lang_settings.time_cancel_transport, worldSettings.misc.trade_cancel_time]);
	listToSend.push([lang_settings.night_bonus, `${worldSettings.night.start_hour} ${language.until} ${worldSettings.night.end_hour}`]);
	listToSend.push([lang_settings.protection_beginners, `${worldSettings.newbie.days} ${language.days}`]);
	listToSend.push([lang_units.archer, getEnableString(worldSettings.game.archers)]);
	
	Table.setInfoTable(listToSend, [language.description, language.values]);
	
	let messageGame = `**${language.settings}**\n`;
	messageGame += '```'+ Table.generateTable() + '```\n';

	listToSend = [];
	listToSend.push([lang_settings.nobleman_purchased_using, worldSettings.snob.gold]);
	listToSend.push([lang_settings.nobleman_distance, worldSettings.snob.max_dist]);
	listToSend.push([lang_settings.loyalty_increase, worldSettings.snob.rise]);

	Table.setInfoTable(listToSend, [language.description, language.values]);	

	let messageSnob = `**${lang_units.snob}**\n`;
	messageSnob += '```'+ Table.generateTable() + '```\n';

	console.log(listToSend);

	listToSend = [];
	listToSend.push([lang_settings.tribe_member_limit, worldSettings.ally.limit]);
	listToSend.push([lang_settings.tribe_levels, getEnableString(worldSettings.ally.levels)]);


	Table.setInfoTable(listToSend, [language.description, language.values]);
	let messageConfig = `**${language.configuration}**\n`;
	messageConfig += '```'+ Table.generateTable() + '```';

	Message.send(contentMessage.channel_id, contentMessage.guild_id, [messageGame, messageSnob, messageConfig]);
}

function getEnableString(value) {
	return value == 1 ? language.active : language.inactive;
}

module.exports = {
	loadInfo: function(result) {
		worldSettings = result;
	},
}

module.exports.checkCommand = checkCommand;
