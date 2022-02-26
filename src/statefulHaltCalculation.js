const in_geofence = require('./inGeofence.js');

const main = (
    __latest_ping,
    __last_ping,
    distance_threshold = 1000,
    duration_threshold = 90000,
    prev_halts = [],
    haltCalculationState = null,
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
    
    if (
        last_ping &&
        haltCalculationState &&
        haltCalculationState.to_time === last_ping.time &&
        haltCalculationState.from_time < last_ping.time
    ) {
        if (in_geofence(haltCalculationState.loc, latest_ping.loc, distance_threshold)) {
            haltCalculationState.to_time = latest_ping.time;
            haltCalculationState.duration =
                latest_ping.time - haltCalculationState.from_time;
        }
        if(halts.length>0 && haltCalculationState.from_time===halts[halts.length - 1].from_time && haltCalculationState.duration>duration_threshold){
            halts[halts.length - 1] = haltCalculationState;
        } else if(haltCalculationState.duration>duration_threshold){
            halts.push(haltCalculationState);
        }
    } else if (last_ping && last_ping.time !== latest_ping.time) {
        if (in_geofence(last_ping.loc, latest_ping.loc, distance_threshold)) {
            haltCalculationState = {
                from_time: last_ping.time,
                to_time: latest_ping.time,
                duration: latest_ping.time - last_ping.time,
                loc: last_ping.loc,
            }

            if(haltCalculationState.duration>duration_threshold){
                halts.push(haltCalculationState);
            }
        }
    }
    return {
        halts: halts.map((k) => ({
        ...k,
        from_time: new Date(k.from_time),
        to_time: new Date(k.to_time),
    })),
    haltCalculationState,
    }
};

const all_halts = (__locations = [], distance_threshold = 1000,duration_threshold = 900000) => {
    const haltCalculationProperties = __locations
        .slice()
        .sort((x, y) => x.time - y.time)
        .reduce((haltProps,currLoc,index,locs) => main(currLoc,index>0 ? locs[index - 1]  : null,distance_threshold,duration_threshold,haltProps.halts,haltProps.haltCalculationState),{
			halts: [],
			haltCalculationState: null,
		})
    return haltCalculationProperties;
};

module.exports = {
    all_halts: all_halts,
    rolling_halt: main,
};