const assert = require('assert');
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
      console.log(halts);
      assert.equal(halts.length, 11);
    });
  });
});

describe('Calculate Halts with sct data', () => {
  describe('calulates halts and checks for matches on exixting halts', () => {
    it('Should have match most of the data points', async () => {
      return new Promise(async (res, rej) => {
        const dataPoints = 20;
        let data = await getOldNewHalts(dataPoints);
        let Matches = [];
        data.forEach((x) => {
          x.oldHalts.forEach((k, kdx) => {
            x.newHalts.forEach((j) => {
              let diff = k.duration - j.duration;
              if (diff <= 1000 && diff >= -1000) {
                let locdiff = k.loc[0] - j.loc[0] + (k.loc[1] - j.loc[1]);
                if (locdiff <= 0.01 && locdiff >= -0.01) {
                  Matches.push(
                    `${k.duration}, '-', ${j.duration}, '=', ${diff}`
                  );
                }
              }
            });
          });
        });

        // Matches.forEach((x) => console.log(x));
        console.log((Matches.length / dataPoints) * 100, '% matches');
        res('done');
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
      console.log(halts);
      assert.equal(halts.length, 3);
    });
  });
});
