const fetch = require('node-fetch');
const config = require('config');

let debugMode = config.get('debugMode');
let messages = [];
let indexMessage = 0;

function sendWebhookMessage(channel_id, guild_id, message) {
	setTimeout(() => {
		fetch(`${config.get('Discord.url_api')}channels/${channel_id}/messages`, {
    	    'method': 'POST',
        	'headers': {
				'content-type': 'application/json',
				'authorization': `Bot ${config.get('Discord.bot_token')}`,
       		 },
        	'body': JSON.stringify(
						{
							'content': message,
							'allowed_mentions': {'parse': ['roles', 'users']}
						}),
    	})
    	.then((response) => {
        	//console.log('response:', response);
    	})
		.then(() => {
			indexMessage++;
			if (indexMessage + 1 <= messages.length) {
				sendWebhookMessage(channel_id, guild_id, messages[indexMessage]);
			}
		});
	}, 200);
}

module.exports = {
    sendMessage: function(channel_id, guild_id, listMessages) {
		indexMessage = 0;
		messages = listMessages;

        if (!debugMode) {
			sendWebhookMessage(channel_id, guild_id, messages[indexMessage]);
		}
		else {
			console.log(messages);
		}
    }
}

