Memory.LogLevel = 3;

var spawnMod = require('SpawnLogic');
var resourceMod = require('ResourceLogic');
var buildMod = require('BuildLogic');
var defenseMod = require('DefenseLogic');
var maintenanceMod = require('Maintenance');

module.exports.loop = function ()
{
    // P1 - Create more creeps
    spawnMod.Execute();

    // P2 - Collect and route resources
    resourceMod.Execute();

    // P3 - Build new structures
    // New structures are rare, no need to check every tick
    buildMod.Execute();

    // P4 - Activate defenses
    defenseMod.Execute();

    // P5 - Clean up
    maintenanceMod.Execute();
};
