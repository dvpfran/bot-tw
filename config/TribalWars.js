const config = require('config');

const selectedWorld = config.get('TribalWarsConfig.world');
const selectedServer= config.get('TribalWarsConfig.server');

const TribalWarsInfo = {
    selected_world: selectedWorld,
    selected_server: selectedServer,
    url: `https://${selectedWorld}.tribalwars.${selectedServer}`,
    world_info: '/interface.php?func=get_config',
    buildings_info: '/interface.php?func=get_building_info',
    units_info: '/interface.php?func=get_unit_info',
    village_info: '/map/village.txt',
    player_info: '/map/player.txt',
    ally_info: '/map/ally.txt',
    kill_all: '/map/kill_all.txt',
    kill_att: '/map/kill_att.txt',
    kill_def: '/map/kill_def.txt',
    kill_all_tribe: '/map/kill_all_tribe.txt',
    kill_att_tribe: '/map/kill_att_tribe.txt',
    kill_def_tribe: '/map/kill_def_tribe.txt',
    conquer: '/map/conquer.txt',
};

module.exports.TribalWarsInfo = TribalWarsInfo;