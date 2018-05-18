'use strict';

const test = require('ava');
const r = require('rethinkdb');
const ForecastModel = require('../lib/models/ForecastModel');
const config = require('../lib/config/');
const fixtures = require('./fixtures/');

test.beforeEach(t => {
	t.context.forecastModel = new ForecastModel();
});

test.afterEach.always('Clean database', async t => {
	let dbName = config.db.db;
	let conn = await r.connect({});
	await r.dbDrop(dbName).run(conn);
});

test('save forecast', async t => {
	const forecastObject = t.context.forecastModel;
	const forecastInsert = fixtures.getForescast();
	const forecastHours = [];
	let forecastCreated = [];
	for (let forecast of forecastInsert) {
		for (let hour of forecast.hour) {
			let insertion = { time: hour.time, temp: hour.temp_c };
			forecastCreated.push(
				await forecastObject.saveForecast(insertion)
			);
			delete insertion.id;
			forecastHours.push(insertion);
		}
	}
	t.deepEqual(forecastHours, forecastCreated);
});
