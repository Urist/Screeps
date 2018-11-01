
Memory.Build.BuiltLastTick = false;

module.exports.Execute = function ()
{
    if (Memory.LogLevel >= 4) console.log('Build module run');
    for (var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];

        // Create new constructions up to the max
        if ((Game.time % 32 === 0 || Memory.Build.BuiltLastTick === true) && sites.length < 3)
        {
            Memory.Build.BuiltLastTick = false;
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
                        Memory.Build.BuiltLastTick = true;
                        return;
                    }
                }
            }

            // Build extension(s) up to the max allowed
            var extensions = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => { return (structure.structureType === STRUCTURE_EXTENSION); }
            });

            if (extensions.length < MaxExtensions(room.controller.level))
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
                    Memory.Build.BuiltLastTick = true;
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
        return room.lookAt(x, y).some(
            (feature) => OBSTACLE_OBJECT_TYPES.includes(feature.type)
        );
    }

    const MAX_SEARCH_RANGE = 9;

    var start = thing.pos;

    for (var range = 1; range < MAX_SEARCH_RANGE; ++range)
    {
        // First look along the x axis
        for (var dx = -1 * range; dx <= 1 * range; ++dx)
        {
            // y + range
            if (IsClear(start.x + dx, start.y + range))
            {
                return new RoomPosition(start.x + dx, start.y + range, room.name);
            }
            // y - range
            if (IsClear(start.x + dx, start.y - range))
            {
                return new RoomPosition(start.x + dx, start.y + range, room.name);
            }
        }
        // Next look along y axis, skipping the corners
        for (var dy = -1 * (range - 1); dy <= 1 * (range - 1); ++dy)
        {
            // x + range
            if (IsClear(start.x + range, start.y + dy))
            {
                return new RoomPosition(start.x + range, start.y + dy, room.name);
            }
            // x - range
            if (IsClear(start.x + range, start.y - dy))
            {
                return new RoomPosition(start.x + range, start.y + dy, room.name);
            }
        }
    }
    if (Memory.LogLevel >= 1) console.log('FindClearSpaceNear failed at position: (' + start.x + ',' + start.y + ',' + room.name + ')');
    return null;
}

function MaxExtensions (ControllerLevel)
{
    switch (ControllerLevel)
    {
    case 0:
    case 1:
        return 0;
    case 2:
        return 5;
    case 3:
        return 10;
    case 4:
        return 20;
    case 5:
        return 30;
    case 6:
        return 40;
    case 7:
        return 50;
    case 8:
        return 60;
    }
}

function logR (returnCode, message)
{
    if (returnCode !== OK && Memory.LogLevel >= 1)
    {
        console.log(returnCode + ' message: ' + message);
    }
}
