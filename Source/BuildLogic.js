
Memory.BuiltLastTick = false;

var helper = require('Helper');

module.exports.Execute = function ()
{
    if (Memory.LogLevel >= 4) console.log('Build module run');
    for (var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];

        // No more than 3 active constructions at a time, drones can only build so fast
        var sites = room.find(FIND_MY_CONSTRUCTION_SITES);

        // Create new constructions up to the max
        if ((Game.time % 32 === 0 || Memory.BuiltLastTick === true) && sites.length < 3)
        {
            Memory.BuiltLastTick = false;
            // Build tower(s), just one for now TODO: build up to max
            if (room.controller.level >= 3)
            {
                // Check if there is a tower in the room
                var towers = room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => { return (structure.structureType === STRUCTURE_TOWER); }
                });

                // Build 1 tower per lvl 3 room
                if (towers.length < 1)
                {
                    // Find a spot (just pick a random creep and build it there)
                    var creeps = room.find(FIND_MY_CREEPS);
                    if (creeps)
                    {
                        logR(room.createConstructionSite(creeps[0].pos, STRUCTURE_TOWER), 'create tower site');
                        if (Memory.LogLevel >= 3) console.log('Placed tower site (' + creeps[0].pos.x + ',' + creeps[0].pos.y + ')');
                        Memory.BuiltLastTick = true;
                        return;
                    }
                }
            }

            // Build extension(s) up to the max allowed
            var extensions = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => { return (structure.structureType === STRUCTURE_EXTENSION); }
            });

            if (extensions.length < helper.MaxExtensions(room.controller.level))
            {
                // Build it near spawn
                var spawn = room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => { return (structure.structureType === STRUCTURE_SPAWN); }
                })[0];
                var pos = FindClearSpaceNear(room, spawn);
                // TODO: some kind of fall back if we don't find a clear space
                if (pos != null)
                {
                    logR(room.createConstructionSite(pos, STRUCTURE_EXTENSION), 'create extension site');
                    if (Memory.LogLevel >= 3) console.log('Placed extension site(' + pos.x + ',' + pos.y + ')');
                    Memory.BuiltLastTick = true;
                    return;
                }
            }
        }

    }
};

function FindClearSpaceNear (room, thing)
{
    function IsClear (x, y)
    {
        var lookList = room.lookAt(x, y);
        return lookList.length === 1 && lookList[0].type === "terrain" && lookList[0].terrain === "plain";
    }

    const MAX_SEARCH_RANGE = 9;

    var start = thing.pos;

    for (var range = 1; range < MAX_SEARCH_RANGE; ++range)
    {
        // First look along the x axis
        for (var dx = -1 * range; dx <= range; ++dx)
        {
            if (dx === 0)
            {
                continue; // cheap way to not block in the spawn
            }
            // y + range
            if (IsClear(start.x + dx, start.y + range))
            {
                return new RoomPosition(start.x + dx, start.y + range, room.name);
            }
            // y - range
            if (IsClear(start.x + dx, start.y - range))
            {
                return new RoomPosition(start.x + dx, start.y - range, room.name);
            }
        }
        // Next look along y axis, skipping the corners
        for (var dy = -1 * (range - 1); dy <= (range - 1); ++dy)
        {
            if (dy === 0)
            {
                continue; // cheap way to not block in the spawn
            }
            // x + range
            if (IsClear(start.x + range, start.y + dy))
            {
                return new RoomPosition(start.x + range, start.y + dy, room.name);
            }
            // x - range
            if (IsClear(start.x - range, start.y + dy))
            {
                return new RoomPosition(start.x - range, start.y + dy, room.name);
            }
        }
    }
    if (Memory.LogLevel >= 1) console.log('FindClearSpaceNear failed at position: (' + start.x + ',' + start.y + ',' + room.name + ')');
    return null;
}

function logR (returnCode, message)
{
    if (returnCode !== OK && Memory.LogLevel >= 1)
    {
        console.log(returnCode + ' message: ' + message);
    }
}
