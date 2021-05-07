const distance = require("@intugine-technologies/distance");
const _ = require("lodash");

const in_geofence = (loc1, loc2, __distance) =>
	distance(loc1, loc2) <= __distance;
const main = (
	__latest_ping,
	__last_ping,
	distance_threshold = 1000,
	prev_halts = []
) => {
	const halts = prev_halts.map((k) => ({
		...k,
		to_time: new Date(k.to_time).valueOf(),
		from_time: new Date(k.from_time).valueOf(),
	}));
	const last_ping = __last_ping
		? { ...__last_ping, time: new Date(__last_ping.time).valueOf() }
		: null;
	const latest_ping = {
		...__latest_ping,
		time: new Date(__latest_ping.time).valueOf(),
	};
	const last_halt = halts.slice(-1)[0];
	if (
		last_ping &&
		last_halt &&
		last_halt.to_time === last_ping.time &&
		last_halt.from_time < last_ping.time
	) {
		if (in_geofence(last_halt.loc, latest_ping.loc, distance_threshold)) {
			halts[halts.length - 1].to_time = latest_ping.time;
			halts[halts.length - 1].duration = latest_ping.time - last_halt.from_time;
		}
	} else if (last_ping && last_ping.time !== latest_ping.time) {
		if (in_geofence(last_ping.loc, latest_ping.loc, distance_threshold)) {
			halts.push({
				from_time: last_ping.time,
				to_time: latest_ping.time,
				duration: latest_ping.time - last_ping.time,
				loc: last_ping.loc,
			});
		}
	}
	return halts.map((k) => ({
		...k,
		from_time: new Date(k.from_time),
		to_time: new Date(k.to_time),
	}));
};

const all_halts = (__locations = [], distance_threshold = 1000) => {
	let halts = [];
	_.sortBy(__locations, "time").forEach((k, kdx, array) => {
		halts = main(k, kdx === 0 ? null : array[kdx - 1], 1000, halts);
	});
	return halts;
};

module.exports = {
	all_halts: all_halts,
	rolling_halt: main,
};