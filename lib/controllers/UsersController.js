'use strict';
const UsersModel = require('../models/UsersModel');
const model = new UsersModel();

class ForecastController {
	static async saveUser(req, res) {
		try {
			const data = req.body;
			const response = await model.saveUser(data);
			res.status(201).json(response);
		} catch (error) {
			res.status(500).json({ message: error.message, stack: error.stack });
		}
	}
}

module.exports = ForecastController;
