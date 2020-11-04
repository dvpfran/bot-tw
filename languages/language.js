const config = require('config');
const selectedLanguage = require(`./${config.get('language')}.json`);

module.exports.language = selectedLanguage;

