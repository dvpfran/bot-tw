const fetch = require('node-fetch');
const config = require('config');

function sendWebhookMessage(message) {
    fetch(config.get('WebhookConfig.url'), {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json',
        },
        'body': JSON.stringify(msg),
    })
    .then((response) => {
        console.log('response:', response);
    })
}

module.exports = {
    sendMessage: function(message) {
        sendWebhookMessage(message);
    }
}

// // const msg = {'content': 'Hello men, this is my first message from bot to discord channel.'};
// function sendWebhookMessage() {

// }

// // sendWebhookMessage();