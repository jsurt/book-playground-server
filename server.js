"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const https = require("https");
const morgan = require("morgan");
const mysql = require("mysql");
const parseString = require("xml2js").parseString;

app.use(cors());
app.use(morgan("combined"));

const { router: googleBooksRouter } = require("./google-books");
const { router: ISBNdbRouter } = require("./isbn-db");

app.use("/google-books", googleBooksRouter);
app.use("/isbn-db", ISBNdbRouter);

app.get("/", (req, res) => {
  console.log("Request made to root");
  res.status(200).send("Root");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password2017",
  database: "huey_test"
});

connection.connect();

connection.end();

app.listen(8080, () => {
  console.log("App is listening on port 8080 \nCORS enbabled");
});
