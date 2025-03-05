
const { Pool } = require("pg");

// Version for db as a microservice
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Version of url_db for solid service
/*
const db = new Pool({
    connectionString: process.env.DB_URL
})
*/

console.log("DB connection established.")

module.exports = db;