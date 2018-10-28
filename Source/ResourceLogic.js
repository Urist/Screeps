/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ResourceLogic');
 * mod.thing == 'a thing'; // true
 */

function GetInterestingTargetList (creep)
{
    var targets = [];
    // If not full, harvesting is a possibility
    if (creep.carry.energy < creep.carryCapacity)
    {
        targets = creep.room.find(FIND_SOURCES);
    }
    if (Memory.LogLevel === 5) console.log('searched sources - ' + targets.length + ' targets');
    // If not empty...
    if (creep.carry.energy > 0)
    {
        // Work on in-progress constructions
        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        targets = targets.concat(sites);
        if (Memory.LogLevel === 5) console.log('searched constructions - ' + targets.length + ' targets');

        // transferring is a possibility
        targets = targets.concat(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        }));
        if (Memory.LogLevel === 5) console.log('searched buildings - ' + targets.length + ' targets');
        // If the room has a controller, power it (lowest priority)
        if (creep.room.controller !== undefined)
        {
            targets.push(creep.room.controller);
        }
        if (Memory.LogLevel === 5) console.log('searched coltroller - ' + targets.length + ' targets');
    }

    return targets;
}

function RouteCreep (creep)
{
    var targets = GetInterestingTargetList(creep);

    if (Memory.LogLevel === 5) console.log(creep.name + ' - targets: ' + targets.length);

    if (targets)
    {
        // Sort targets by linear distance to creep
        targets.sort(function (a, b) { return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b); });

        var workTarget = targets[0];

        if (workTarget instanceof Source)
        {
            if (creep.harvest(workTarget) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(workTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else if (workTarget instanceof Structure)
        {
            if (creep.transfer(workTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(workTarget, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else if (workTarget instanceof ConstructionSite)
        {
            if (creep.build(workTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(workTarget, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports.Execute = function ()
{
    for (var creep in Game.creeps)
    {
        RouteCreep(Game.creeps[creep]);
    }
};
