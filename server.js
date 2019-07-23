"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./database");
const https = require("https");
const morgan = require("morgan");
const mysqlx = require("@mysql/xdevapi");
const parseString = require("xml2js").parseString;

app.use(bodyParser.json());
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

app.listen(8080, () => {
  console.log("App is listening on port 8080 \nCORS enbabled");
});

process.on("SIGINT", () => {
  console.log("Bye bye!");
  process.exit();
});
