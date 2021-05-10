# locswarm

locswarm is a clustering function to find halts in time series location data. can be used for any time-series location data.

## **Install**

```bash
npm i @intugine-technologies/locswarm
```

## Test

```bash
npm run test
```

## Usage

```bash
const calc_halts = require('@intugine-technologies/locswarm').all_halts;

let testData = [
	{ name: 'A', loc: [10, 10], createdAt: new Date('2020-01-01') },
	{ name: 'A', loc: [10, 10], createdAt: new Date('2020-01-02') },
	{ name: 'A', loc: [10, 10], createdAt: new Date('2020-01-03') },
	{
		name: 'B',
		loc: [100, 100],
		createdAt: new Date('2020-01-04'),
	},
	{
		name: 'B',
		loc: [100, 100],
		createdAt: new Date('2020-01-05'),
	},
	{
		name: 'C',
		loc: [500, 500],
		createdAt: new Date('2020-01-06'),
	},
	{
		name: 'C',
		loc: [500, 500],
		createdAt: new Date('2020-01-07'),
	},
	{
		name: 'C',
		loc: [500, 500],
		createdAt: new Date('2020-01-08'),
	},
	{
		name: 'D',
		loc: [1000, 1000],
		createdAt: new Date('2020-01-09'),
	},
	{
		name: 'E',
		loc: [1200, 1200],
		createdAt: new Date('2020-01-10'),
	},
];
const halts = calc_halts(
	testData.map((i) => ({
		loc: i.loc || i.gps,
		time: new Date(i.time || i.createdAt),
	})),
	1000
);
console.log(halts);

// halts = [
//     {
//       from_time: 2020-01-01T00:00:00.000Z,
//       to_time: 2020-01-03T00:00:00.000Z,
//       duration: 172800000,
//       loc: [ 10, 10 ]
//     },
//     {
//       from_time: 2020-01-04T00:00:00.000Z,
//       to_time: 2020-01-05T00:00:00.000Z,
//       duration: 86400000,
//       loc: [ 100, 100 ]
//     },
//     {
//       from_time: 2020-01-06T00:00:00.000Z,
//       to_time: 2020-01-08T00:00:00.000Z,
//       duration: 172800000,
//       loc: [ 500, 500 ]
//     }
//   ]
```