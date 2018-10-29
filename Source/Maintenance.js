/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Maintenance');
 * mod.thing == 'a thing'; // true
 */

module.exports.Execute = function ()
{
    for (var name in Memory.creeps)
    {
        if (!Game.creeps[name])
        {
            delete Memory.creeps[name];
            if (Memory.LogLevel >= 3) console.log('Creep ' + name + ' no longer exists');
        }
    }
};
