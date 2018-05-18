'use strict';

require('../index');
const test = require('ava');
const config = require('../lib/config/');
const request = require('request-promise');

test('GET weather', async t => {
	const options = {
		method: 'GET',
		uri: `http://localhost:${config.port}/weather?lang=es&q=Argentina`,
		json: true
	};

	let response = await request(options);
	t.truthy(response.temp);
});
