/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('DefenseLogic');
 * mod.thing == 'a thing'; // true
 */

module.exports.Execute = function ()
{
    for (var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0)
        {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    }
};
