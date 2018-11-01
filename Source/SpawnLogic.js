/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnLogic');
 * mod.thing == 'a thing'; // true
 */

// Body part       Build cost
// MOVE	            50
// WORK	            100
// CARRY	        50
// ATTACK	        80
// RANGED_ATTACK	150
// HEAL	            250
// CLAIM	        600
// TOUGH	        10

var helper = require('Helper');

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

        // Spawn new basic creeps
        if (harvesters.length < 5)
        {
            for (var spawnName in Game.spawns)
            {
                var spawn = Game.spawns[spawnName];
                if (!spawn.spawning)
                {
                    // MOVE + WORK + CARRY = 200
                    var creepSizeMultiplier = Math.floor(helper.AvailableSpawnEnergy(room) / 200);

                    if (creepSizeMultiplier > 0)
                    {
                        var bodyFormula = new Map(
                            [
                                [WORK, creepSizeMultiplier],
                                [CARRY, creepSizeMultiplier],
                                [MOVE, creepSizeMultiplier]
                            ]);
                        var body = MakeBody(bodyFormula);
                        if (Memory.LogLevel >= 3) console.log('Spawning new creep, body: ' + body);
                        var ret = spawn.spawnCreep(body, RandomCreepName());
                        logR(ret, 'spawnCreep');
                    }
                }
            }
        }
    }
}

function MakeBody (formula)
{
    var body = [];
    for (const [key, value] of formula)
    {
        body = body.concat(Array(value).fill(key));
    }
    return body;
}

module.exports.Execute = Execute;
