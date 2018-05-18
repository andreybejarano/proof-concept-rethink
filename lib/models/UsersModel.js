'use strict';

const ConnectionDB = require('./ConnectionDB');
const config = require('../config/');
const connection = new ConnectionDB(config.db);

class UsersModel {
	constructor() {
		this.dbTable = 'users';
	}

	async saveUser(data) {
		try {
			await connection.connect();
			let created = await connection.insert(this.dbTable, data);
			delete created.id;
			await connection.disconnect();
			return Promise.resolve(created);
		} catch (error) {
			return Promise.reject(new Error(error));
		}
	}

	async getUsers() {
		try {
			await connection.connect();
			let forecast = await connection.get(this.dbTable);
			await connection.disconnect();
			return Promise.resolve(forecast);
		} catch (error) {
			return Promise.reject(new Error(error));
		}
	}
}

module.exports = UsersModel;
