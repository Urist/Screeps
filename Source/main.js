Memory.LogLevel = 3;

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var spawnMod = require('SpawnLogic');
var resourceMod = require('ResourceLogic');
var buildMod = require('BuildLogic');
var defenseMod = require('DefenseLogic');

module.exports.loop = function () {

    // P1 - Create more creeps
    spawnMod.Execute();
    
    // P2 - Collect and route resources
    resourceMod.Execute();
    
    // P3 - Build new structures
    buildMod.Execute();
    
    // P4 - Activate defenses
    defenseMod.Execute();
       
}


var oldCode = function () {

    var tower = Game.getObjectById('f052c2402db5e0bc431525af');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
