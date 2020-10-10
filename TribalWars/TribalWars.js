const fetch = require('node-fetch');
const fs = require('fs');

const Conquer = require('./Conquer');
const { TribalWarsInfoType } = require('../config/Enums');
const { TribalWarsInfo } = require('../config/TribalWars');

function getUrlParam(type) {
    let urlParam = '';

    switch(type) {
        case TribalWarsInfoType.WORLD:
            urlParam = TribalWarsInfo.world_info;
            break;
        case TribalWarsInfoType.BUILDINGS:
            urlParam = TribalWarsInfo.buildings_info;
            break;
        case TribalWarsInfoType.UNITS:
            urlParam = TribalWarsInfo.units_info;
            break;
        case TribalWarsInfoType.VILLAGE:
            urlParam = TribalWarsInfo.village_info;
            break;
        case TribalWarsInfoType.PLAYER:
            urlParam = TribalWarsInfo.player_info;
            break;
        case TribalWarsInfoType.ALLY:
            urlParam = TribalWarsInfo.ally_info;
            break;
        case TribalWarsInfoType.KILL_ALL:
            urlParam = TribalWarsInfo.kill_all;
            break;
        case TribalWarsInfoType.KILL_ATT:
            urlParam = TribalWarsInfo.kill_att;
            break;
        case TribalWarsInfoType.KILL_DEF:
            urlParam = TribalWarsInfo.kill_def;
            break;
        case TribalWarsInfoType.KILL_ALL_TRIBE:
            urlParam = TribalWarsInfo.kill_all_tribe;
            break;
        case TribalWarsInfoType.KILL_ATT_TRIBE:
            urlParam = TribalWarsInfo.kill_att_tribe;
            break;
        case TribalWarsInfoType.KILL_DEF_TRIBE:
            urlParam = TribalWarsInfo.kill_def_tribe;
            break;
        case TribalWarsInfoType.CONQUER:
            urlParam = TribalWarsInfo.conquer;
            break;
    }
    return urlParam;
}

function getInfo(type) {
	return new Promise((resolve, recjet) => {
   		const url = TribalWarsInfo.url;
        let urlParam = getUrlParam(type);
            
        fetch(`${url}${urlParam}`,  {
        	'method': 'GET',
            'headers': {
	            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate, br',
				'Accept-Language': 'en-US,en;q=0.5',
				'Host': url.substr("https://".length),
			},
		})
		.then(response => response.text())
		.then(data => {
			if (data) {
				data = decodeURI(data).split('+').join(' ');
				const info = data.split('\n');
				resolve(info);
			}
			else {
				resolve('Ups, erro');
			}
		});
	});
}

function getInfoFile() {
	var data = fs.readFileSync('./data_received/player.txt', 'utf8');
    return decodeURI(data).split('+').join('+', ' ');
}

module.exports.getInfo = getInfo;
module.exports.getInfoFile = getInfoFile;
module.exports.getConquers = Conquer.getConquers;
module.exports.checkNewConquers = Conquer.checkNewConquers;
