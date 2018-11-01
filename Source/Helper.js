
/* Import with:
var helper = require('Helper');
*/

module.exports.MaxExtensions = function MaxExtensions (ControllerLevel)
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
};

module.exports.AvailableSpawnEnergy = function AvailableSpawnEnergy (room)
{
    var structures = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) =>
        {
            return (
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION);
        }
    });

    var energy = 0;
    structures.forEach(element =>
    {
        energy += element.energy;
    });

    return energy;
};
