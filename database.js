"use strict";

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password2017",
  database: "huey_test"
});

connection.connect((error, connection) => {
  if (error) throw error;
  console.log("Connection established");
});

module.exports = connection;
