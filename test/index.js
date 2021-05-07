const assert = require('assert');
const calc_halts = require('../index.js').all_halts;
const data_sets = require('./data_sets/index.js');

describe("Calculate Halts", () => {
	describe("Default conditions", () => {
		it("Should have length 11", () => {
			const halts = calc_halts(data_sets.set1.map(i => ({
			    loc: i.loc || i.gps,
			    time: new Date(i.time || i.createdAt)
			})), 1000);
			assert.equal(halts.length, 11);
		});
		it("Should have no zero duration halts", () => {
			const halts = calc_halts(data_sets.set2.map(i => ({
			    loc: i.loc || i.gps,
			    time: new Date(i.time || i.createdAt)
			})), 200);
			assert.equal(halts.filter(k => k.duration === 0).length, 0);
		});
	})
});