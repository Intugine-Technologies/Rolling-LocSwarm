// const Joi = require('joi');
const distance = require("@intugine-technologies/distance");

// const schema = require('./schema');
const in_geofence = (loc1, loc2, __distance) =>
	distance(loc1, loc2) <= __distance;
const main = (
	latest_ping,
	last_ping,
	distance_threshold = 1000,
	prev_halts = []
) => {
	// try{
	// 	//Check schema
	// 	Joi.assert(undefined, schema.ping)
	// } catch(e){
	// 	throw e;
	// }

	const halts = prev_halts.map((k) => ({
		...k,
	}));
	const last_halt = halts.slice(-1)[0];
	if (
		last_ping &&
		last_halt &&
		last_halt.to_time === last_ping.time &&
		last_halt.from_time < last_ping.time
	) {
		if (in_geofence(last_ping.loc, latest_ping.loc, distance_threshold)) {
			halts[halts.length - 1].to_time = latest_ping.time;
			halts[halts.length - 1].duration =
				latest_ping.time.valueOf() - last_halt.from_time.valueOf();
		}
	} else if (last_ping) {
		if (in_geofence(last_ping.loc, latest_ping.loc, distance_threshold)) {
			halts.push({
				from_time: last_ping.time,
				to_time: latest_ping.time,
				duration: latest_ping.time.valueOf() - last_ping.time.valueOf(),
				loc: last_ping.loc,
			});
		}
	}
	return halts;
};

const all_halts = (locations = [], distance_threshold = 1000) => {
	let halts = [];
	locations.forEach((k, kdx) => {
		halts = main(k, kdx === 0 ? null : locations[kdx - 1], 1000, halts);
	});
	return halts;
};

module.exports = {
	all_halts: all_halts,
	rolling_halt: main,
};