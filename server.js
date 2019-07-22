"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const https = require("https");
const morgan = require("morgan");
// const mysql = require("mysql");
const mysqlx = require('@mysql/xdevapi');
const parseString = require("xml2js").parseString;

app.use(cors());
app.use(morgan("combined"));

const { router: bookRouter } = require("./controllers/books");
const { router: googleBooksRouter } = require("./controllers/google-books");
const { router: ISBNdbRouter } = require("./controllers/isbn-db");

app.use("/books", bookRouter);
app.use("/google-books", googleBooksRouter);
app.use("/isbn-db", ISBNdbRouter);      


app.get("/", (req, res) => {
  console.log("Request made to root");
  res.status(200).send("Root");
});

const config = {
  password: 'password2017',
  user: 'root',
  host: 'localhost',
  port: 33060,
  schema: 'huey_test'
};

mysqlx
  .getSession(config)
  .then(session => {
      console.log(session.inspect());
      return session.getSchemas();
      // { user: 'root', host: 'localhost', port: 33060 }
  })
  .then(schemas => {
    console.log(schemas);
  })

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "jsurtees",
//   password: "password2017",
//   database: "huey_test"
// })

// connection.connect();

// connection.end();

app.listen(8080, () => {
  console.log("App is listening on port 8080 \nCORS enbabled");
});

process.on('SIGINT', () => { 
  console.log("Bye bye!"); 
  process.exit(); 
});

module.exports = { config };