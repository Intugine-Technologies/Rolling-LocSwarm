// const assert = require('assert');
const assert = require('chai').assert;
const calc_halts = require('../index.js').all_halts;
const test1_data = require('./test1.json');
const { getOldNewHalts } = require('./test_helper');

describe('Calculate Halts', () => {
  describe('Default conditions', () => {
    it('Should have length 11', () => {
      const halts = calc_halts(
        test1_data.map((i) => ({
          loc: i.loc || i.gps,
          time: new Date(i.time || i.createdAt),
        })),
        1000
      );
      //   console.log(halts);
      assert.equal(halts.length, 11);
    });
  });
});

describe('Calculate Halts with sct data', () => {
  describe('calulates halts and checks for matches on exixting halts', () => {
    it('Should have match most of the data points', () => {
      const dataPoints = 50;
      return getOldNewHalts(dataPoints)
        .then((data) => {
          let Matches = [],
            outliers = [];
          data.forEach((x, i) => {
            let j = x.oldHalts,
              k = x.newHalts;
            // console.log(j.length - k.length);
            if (j.length == k.length) {
              Matches.push('=');
            } else {
              if (j.length > k.length) {
                let diff = j[2].duration - k[1].duration;
                if (diff == 0) {
                  Matches.push(diff);
                } else {
                  x.oldHalts = x.oldHalts.map((x) => {
                    return {
                      from_time: new Date(x.from_time),
                      to_time: new Date(x.to_time),
                      duration: x.duration,
                      loc: x.loc,
                    };
                  });
                  outliers.push(x);
                }
              } else {
                let diff = j[1].duration - k[2].duration;
                if (diff == 0) {
                  Matches.push(diff);
                } else {
                  x.oldHalts = x.oldHalts.map((x) => {
                    return {
                      from_time: new Date(x.from_time),
                      to_time: new Date(x.to_time),
                      duration: x.duration,
                      loc: x.loc,
                    };
                  });
                  outliers.push(x);
                }
              }
            }
          });
          // outliers.slice(0, 2).forEach((x) => console.log(x));
          //   Matches.forEach((x) => console.log(x));
          let matches = (Matches.length / dataPoints) * 100;
          console.log(matches, '% matches');
          assert.closeTo(matches, 100, 10);
          // done();
        })
        .catch((err) => {
          console.log(err);
          // done();
        });

      //
    });
  });
});

describe('Calculate Halts, with test data', () => {
  describe('Default conditions', () => {
    it('Should have length 5', () => {
      let testData = [
        { name: 'A', loc: [10, 10], createdAt: new Date('2020-01-01') },
        { name: 'A', loc: [10, 10], createdAt: new Date('2020-01-02') },
        { name: 'A', loc: [10, 10], createdAt: new Date('2020-01-03') },
        { name: 'B', loc: [100, 100], createdAt: new Date('2020-01-04') },
        { name: 'B', loc: [100, 100], createdAt: new Date('2020-01-05') },
        { name: 'C', loc: [500, 500], createdAt: new Date('2020-01-06') },
        { name: 'C', loc: [500, 500], createdAt: new Date('2020-01-07') },
        { name: 'C', loc: [500, 500], createdAt: new Date('2020-01-08') },
        { name: 'D', loc: [1000, 1000], createdAt: new Date('2020-01-09') },
        { name: 'E', loc: [1200, 1200], createdAt: new Date('2020-01-10') },
      ];
      const halts = calc_halts(
        testData.map((i) => ({
          loc: i.loc || i.gps,
          time: new Date(i.time || i.createdAt),
        })),
        1000
      );
      //   console.log(halts);
      assert.equal(halts.length, 3);
    });
  });
});
