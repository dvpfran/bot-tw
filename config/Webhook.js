const fetch = require('node-fetch');
const config = require('config');

let debugMode = config.get('debugMode');
let messages = [];
let indexMessage = 0;

function sendWebhookMessage(message) {
    console.log(message.length);
	setTimeout(() => {
		fetch(config.get('WebhookConfig.url'), {
    	    'method': 'POST',
        	'headers': {
            	'content-type': 'application/json',
       		 },
        	'body': JSON.stringify({'content': message}),
    	})
    	.then((response) => {
        	console.log('response:', response);
    	})
		.then(() => {
			indexMessage++;
			if (indexMessage + 1 <= messages.length) {
				sendWebhookMessage(messages[indexMessage]);
			}
		});
	}, 200);
}

module.exports = {
    sendMessage: function(listMessages) {
		indexMessage = 0;
		messages = listMessages;
        if (!debugMode) {
			sendWebhookMessage(messages[indexMessage]);
		}
		else {
			console.log(messages);
		}
    }
}

