const { Pool } = require('pg');
const config = require('config');

let pool;

module.exports = {
	connect: function() {
		pool = new Pool({
			user: config.get('Database.user'),
			host: config.get('Database.host'),
			database: config.get('Database.database'),
			password: config.get('Database.password'),
			port: config.get('Database.port'),
		});
	},
	query: function(text, values = []) {
		return new Promise((resolve, reject) => {
			pool.query(text, values, (error, response) => {
				if (error) {
					console.log(error);
					reject(error.stack);
				}
				else {
					resolve(response.rows);
				}
			});
		});
	}
}

