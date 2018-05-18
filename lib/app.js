'use strict';

const expressApp = require('express')();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/');
const basePath = '';

// use morgan for logs in development
expressApp.use(morgan('dev'));

// disabled x-powered-by for security
expressApp.disable('x-powered-by');

// Parse body params and attach them to req.body
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

// include routes and expose in base path
expressApp.use(basePath, require('./routes/api-routes'));

expressApp.listen(config.port, () => {
	console.log(`Server started on port ${config.port} (${env})`);
});

module.exports = expressApp;
