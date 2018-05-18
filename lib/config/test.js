const uuid = require('uuid-base62');
module.exports = {
	db: {
		host: 'localhost',
		port: 28015,
		db: `bondacom_db_${uuid.v4()}`,
		setup: true
	},
	port: 5001
};
