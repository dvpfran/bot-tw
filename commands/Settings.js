
const Message = require('../config/Message');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const Table = require('../tools/generate-table/generate_table');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');
const config = require('config');

function checkCommand(args) {
	const param = args[0];
	const value = args[1];

	switch(param) {
		case 'server':
			selectedServer = value;
			break;
		case 'world':
			selectedWorld = value;
			break;
	}
	console.log('selectedWorld:', selectedWorld);
	console.log('selectedServer:', selectedServer);
}

function setDefaultValues() {
	selectedWorld = config.get('TribalWarsConfig.world')
	selectedServer = config.get('TribalWarsConfig.server')
}
 
module.exports.checkCommand = checkCommand;
module.exports.setDefaultValues = setDefaultValues;
