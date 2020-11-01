const process = require('process');
const config = require('config');
const WebSocket = require("ws");

const { GatewayOPCodes } = require('./Enums');
const Command = require('../commands/Command');
let ws = null;

let debugMode = config.get('debugMode');

function initialize() {
	if (!debugMode) {
    	ws = new WebSocket(config.get('Discord.url_gateway'), {});
		ws.on('open', wsOpen);
		ws.on('message', wsMessage);
		ws.on('error', wsError);
		ws.on('close', wsClose);
	}
}

function wsOpen() {
    console.log('ws open');
}   

function wsMessage(data) {
    data = JSON.parse(data);
    if (!debugMode) {
		if (data.op === GatewayOPCodes.HELLO) {
			sendIdentify();
        	startTimerHearbeat(data.d.heartbeat_interval);
    	}
    	else if (data.op === GatewayOPCodes.EVENT) {
        	if (data.t === 'MESSAGE_CREATE') {
            	if (data.d.content.startsWith('!')) {
	            	Command.checkCommand({channel_id: data.d.channel_id, guild_id: data.d.guild_id, command: data.d.content});
            	}
    		}	
		}
	}	
}

function wsError(data) {
    console.log('ws error:', data);
}

function wsClose(data) {
    console.log('ws close:', data);
}

function wsSend(data) {
	if (!debugMode) {
	    ws.send(JSON.stringify(data));
	}
}

function sendIdentify() {
    const identify = {
        "op": GatewayOPCodes.IDENTIFY,
        "d": {
            "token": config.get('Discord.bot_token'),
            "properties": {
                "$os": process.platform,
                "$browser": "disco",
                "$device": "disco"
            },
        },
        's': null,
        't': null,
    }
    wsSend(identify);
}

function startTimerHearbeat(heartbeat_interval){
    setInterval(() => {
        wsSend({'op': GatewayOPCodes.HEARTBEAT, d: {}});
    }, heartbeat_interval);
}

module.exports.initialize = initialize;
module.exports.sendMessage = wsSend;
