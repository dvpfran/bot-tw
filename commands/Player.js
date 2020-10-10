const Webhook = require('../config/Webhook');
const Command = require('./Command');
const TribalWars = require('../TribalWars/TribalWars');
const { TribalWarsInfoType, GatewayOPCodes } = require('../config/Enums');

class Player {
    constructor(id, name, tribe_id, villages, points, rank) {
        this.id = id;
        this.name = name;
        this.tribe_id = tribe_id;
        this.villages = villages;
        this.points = points;
        this.rank = rank;
    }
}

const SortType = {
    RANK: 0,
    POINTS: 1,
    VILLAGES: 2,
};

let listPlayers = [];
let lastSort = SortType.RANK; // sort rank by default

function sortPlayers(sortType) {
    switch(sortType) {
        case SortType.RANK:
            listPlayers.sort((a, b) => {
                if (a.rank > b.rank) {
                    return 1;
                }
                else if (a.rank < b.rank) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            break;
        case SortType.POINTS:
            listPlayers.sort((a, b) => {
                return b.points - a.points;
            });
            break;
        case SortType.VILLAGES:
            listPlayers.sort((a, b) => {
                return b.villages - a.villages;
            });
            break;
    }
}

function getTopRank(number) {
    lastSort !== SortType.RANK && sortPlayers(SortType.RANK);
    lastSort = SortType.RANK;
    for(let index = 0; index < number; index++) {
        console.log(listPlayers[index].rank, listPlayers[index].points, listPlayers[index].villages, listPlayers[index].name);
    }
}

function getTopVillage(number) {
    lastSort !== SortType.VILLAGES && sortPlayers(SortType.VILLAGES);
    lastSort = SortType.VILLAGES;
    for(let index = 0; index < number; index++) {
        console.log(listPlayers[index].rank, listPlayers[index].points, listPlayers[index].villages, listPlayers[index].name);
    }
}

function getTopPoints(number) {
    lastSort !== SortType.POINTS && sortPlayers(SortType.POINTS);
    lastSort = SortType.POINTS;

    let topPoints = '';
    for(let index = 0; index < number; index++) {
        topPoints += `${listPlayers[index].rank}, ${listPlayers[index].points}, ${listPlayers[index].villages}, ${listPlayers[index].name}\n`;
    }
    send(topPoints);
}

function send(content) {
    Webhook.sendMessage(content);
}

function getName(name) {

}

module.exports = {
    fillList: function() {
        TribalWars.getInfo(TribalWarsInfoType.PLAYER).then((result) => { 
            for(let index = 0; index < info.length; index++) {
                const item = result[index].split(',');
                listPlayers.push(new Player(item[0], item[1], parseInt(item[2]), parseInt(item[3]), parseFloat(item[4]), parseInt(item[5])));
            }
        });           
    },
    fillListFromFile: function() {
        let info = TribalWars.getInfoFile().split('\n');

        for(let index = 0; index < info.length; index++) {
            const item = info[index].split(',');
            listPlayers.push(new Player(item[0], item[1], parseInt(item[2]), parseInt(item[3]), parseFloat(item[4]), parseInt(item[5])));
        }
        sortPlayers(SortType.RANK);
    },
    checkCommand: function(args) {
        console.log('args:', args);
        const filterType = args[0];
        const filter = args[1];

        if (filter.includes('top')) {
            const number = parseInt(filter.substr('top'.length));
            if (filterType === 'rank') {
                getTopRank(number);
            }
            else if (filterType === 'village') {
                getTopVillage(number);
            }
            else if (filterType === 'points') {
                getTopPoints(number);
            }
        }
        else if (filterType === 'name') {
            getName(filter);
        }
    }
}
