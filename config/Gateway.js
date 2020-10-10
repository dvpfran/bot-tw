const process = require('process');
const config = require('config');
const WebSocket = require("ws");

const { GatewayOPCodes } = require('./Enums');
const Command = require('../commands/Command');
let ws = null;

function initialize() {
    ws = new WebSocket(config.get('GatewayConfig.address'), {});
    ws.on('open', wsOpen);
    ws.on('message', wsMessage);
    ws.on('error', wsError);
    ws.on('close', wsClose);
};

function wsOpen() {
    console.log('ws open');
}   

function wsMessage(data) {
    console.log('received message:', data);
    data = JSON.parse(data);
    if (data.op === GatewayOPCodes.HELLO) {
        sendIdentify();
        startTimerHearbeat(data.d.heartbeat_interval);
    }
    else if (data.op === GatewayOPCodes.EVENT) {
        if (data.t === 'MESSAGE_CREATE') {
            if (data.d.content.startsWith('!')) {
                Command.checkCommand(data.d.content);
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
    console.log('enviou mensagem:', data);
    ws.send(JSON.stringify(data));
}

function sendIdentify() {
    const identify = {
        "op": GatewayOPCodes.IDENTIFY,
        "d": {
            "token": config.get('GatewayConfig.token'),
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