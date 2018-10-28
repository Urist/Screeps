/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnLogic');
 * mod.thing == 'a thing'; // true
 */

function logR (returnCode, message)
{
    if (returnCode !== OK && Memory.LogLevel >= 1)
    {
        console.log(returnCode + ' message: ' + message);
    }
};

function RandomCreepName ()
{
    return 'Creep' + Math.floor(Math.random() * 1000);
}

function Execute ()
{
    for (var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];
        var harvesters = room.find(FIND_MY_CREEPS);

        // Spawn new basic creeps (TODO: clean up old creeps)
        if (harvesters.length < 5)
        {
            for (var spawnName in Game.spawns)
            {
                if (!Game.spawns[spawnName].spawning)
                {
                    if (Memory.LogLevel >= 3) console.log('Spawning new creep');
                    var ret = Game.spawns[spawnName].spawnCreep([WORK, CARRY, MOVE], RandomCreepName());
                    logR(ret, 'spawnCreep');
                }
            }
        }
    }
}

module.exports.Execute = Execute;
