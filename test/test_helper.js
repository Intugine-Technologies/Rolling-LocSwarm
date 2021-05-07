var Promise = require('bluebird');
const db = require('./db');
const calc_halts = require('../index.js').all_halts;
const halts = require('@intugine-technologies/halts');

const getData = async (dataPoints) => {
  try {
    let DB = await db.getDB();
    let tripData = await DB.read(
      'trips',
      { running: false, submit: false, halts: { $size: 1 } },
      dataPoints,
      0,
      { _id: 1, halts: 1 },
      { _id: -1 }
    );

    let statusData = await Promise.map(tripData, async (trip, tripdx) => {
      let tempStatus = await DB.read(
        'status',
        { tripId: trip._id },
        'all',
        0,
        {
          loc: 1,
          createdAt: 1,
        },
        { _id: 1 }
      );

      return { oldHalts: trip.halts, status: tempStatus, trip_id: trip._id };
    });

    return statusData;
  } catch (err) {
    console.log(err);
  }
};

const getOldNewHalts = async (dataPoints) => {
  let data = await getData(dataPoints);
  let finalData = [];
  data.map((x) => {
    let newHalts = calc_halts(
      x.status.map((i) => ({
        loc: i.loc || i.gps,
        time: new Date(i.time || i.createdAt),
      })),
      1000
    );
    let oldHalts = halts(
      x.status.map((i) => ({
        loc: i.loc || i.gps,
        time: new Date(i.time || i.createdAt),
      })),
      1000,
      0
    );

    finalData.push({
      oldHalts: oldHalts,
      newHalts: newHalts,
      trip_id: x.trip_id,
    });
  });

  return finalData;
};

exports.getOldNewHalts = getOldNewHalts;
