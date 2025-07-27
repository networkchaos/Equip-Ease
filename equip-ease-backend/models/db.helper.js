const pool = require('../config/db');

exports.query = (text, params) => pool.query(text, params);
