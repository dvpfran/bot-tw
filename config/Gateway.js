const process = require('process');
const WebSocket = require("ws");
const { GatewayOPCodes } = require('./Enums');

let ws = null;

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
            "token": "NzU2NzYyNTQxMDc3ODIzNTY4.X2WkCQ.VsLjZg4Vn8ZVetU5ldomfLnRy0M",
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

module.exports = {
    initialize: function() {
        ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json', {});
        ws.on('open', wsOpen);
        ws.on('message', wsMessage);
        ws.on('error', wsError);
        ws.on('close', wsClose);
    },
    sendMessage: function(data) {
        wsSend(data);
    }
}