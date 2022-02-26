const distance = require('@intugine-technologies/distance');

const in_geofence = (loc1, loc2, __distance) =>
    distance(loc1, loc2) <= __distance;

module.exports = in_geofence;