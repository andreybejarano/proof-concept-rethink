'use strict';
const r = require('rethinkdb');
const config = require('../config/');

class ConnectionDB {
	constructor(options) {
		options = options || {};
		this.host = options.host || config.db.host;
		this.port = options.port || config.db.port;
		this.db = options.db || config.db.db;
		this.setup = options.setup || false;
		this.connected = false;
	}

	async setDataBase(connection) {
		try {
			let conn = await connection;
			let dbList = await r.dbList().run(conn);
			if (dbList.indexOf(this.db) === -1) {
				await r.dbCreate(this.db).run(conn);
			}
			return conn;
		} catch (error) {
			throw new Error(error);
		}
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.connection = r.connect({
				host: this.host,
				port: this.port
			});
			this.connection.then(conn => {
				this.connected = true;
				if (this.setup) {
					resolve(this.setDataBase(this.connection));
				} else {
					resolve(this.connection);
				}
			}).error((err) => {
				this.connected = false;
				reject(new Error(err));
			});
		});
	}

	insert(dbTable, record) {
		let connection = this.connection;
		let db = this.db;
		let task = async function () {
			let conn = await connection;
			let dbTables = await r.db(db).tableList().run(conn);
			if (dbTables.indexOf(dbTable) === -1) {
				await r.db(db).tableCreate(dbTable).run(conn);
			}
			let result = await r.db(db).table(dbTable).insert(record).run(conn);
			if (result.errors > 0) {
				throw new Error(result.first_error);
			}
			record.id = result.generated_keys[0];
			let created = await r.db(db).table(dbTable).get(record.id).run(conn);
			return created;
		};

		return new Promise((resolve, reject) => {
			if (!this.connected) {
				reject(new Error('not connected'));
			} else {
				this.connection.then(conn => {
					try {
						resolve(task());
					} catch (err) {
						reject(new Error(err));
					}
				});
			}
		});
	}

	get(dbTable) {
		let connection = this.connection;
		let db = this.db;
		let task = async function () {
			let conn = await connection;
			let records = await r.db(db).table(dbTable).run(conn);
			let result = await records.toArray();
			return result;
		};

		return new Promise((resolve, reject) => {
			if (!this.connected) {
				reject(new Error('not connected'));
			} else {
				this.connection.then(conn => {
					try {
						resolve(task());
					} catch (err) {
						reject(new Error(err));
					}
				});
			}
		});
	}

	disconnect() {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				reject(new Error('Not connected'));
			} else {
				this.connection.then(conn => {
					conn.close().then(() => {
						this.connected = false;
						resolve('Disconected Ok');
					}).error(err => {
						reject(new Error(err));
					});
				});
			}
		});
	}
}

module.exports = ConnectionDB;
