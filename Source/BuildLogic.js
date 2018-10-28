/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('BuildLogic');
 * mod.thing == 'a thing'; // true
 */

module.exports.Execute = function ()
{
    for(var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];
        if(room.controller.level >= 3)
        {
            // Check if there is a tower in the room
            var towers = room.find(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
            });

            // Build 1 tower per lvl 3 room
            if(towers.length < 1)
            {
                // Find a spot (just pick a random creep and build it there)
                var creeps = room.find(FIND_MY_CREEPS);
                if(creeps)
                {
                    room.createConstructionSite(creeps[0].pos, STRUCTURE_TOWER);
                }
            }
        }
    }
};
