const assert = require('assert');
const calc_halts = require('../index.js').all_halts;
const test1_data = require('./test1.json');

describe("Calculate Halts", () => {
	describe("Default conditions", () => {
		it("Should have length 11", () => {
			const halts = calc_halts(test1_data.map(i => ({
			    loc: i.loc || i.gps,
			    time: new Date(i.time || i.createdAt)
			})), 1000);
			console.log(halts);
			assert.equal(halts.length, 11);
		});
	})
});