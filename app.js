const express = require('express');
const Gateway = require('./config/Gateway');

var app = express();

app.listen(3000, () => {
    console.log('Server running on port 3000');
    Gateway.initialize();
});
