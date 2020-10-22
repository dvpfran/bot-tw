const fetch = require('node-fetch');
const config = require('config');

let debugMode = config.get('debugMode');

function sendWebhookMessage(message) {
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
}

module.exports = {
    sendMessage: function(message) {
        if (!debugMode) {
			sendWebhookMessage(message);
		}
		else {
			console.log(message);
		}
    }
}

