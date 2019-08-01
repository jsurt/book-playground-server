"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./database");
const https = require("https");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const mysqlx = require("@mysql/xdevapi");
const parseString = require("xml2js").parseString;
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
app.use(passport.initialize());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

const { localStrategy } = require("./auth/strategies/local");
const { router: bookRouter } = require("./controllers/books");
const { router: googleBooksRouter } = require("./controllers/google-books");
const { router: ISBNdbRouter } = require("./controllers/isbn-db");
const { router: userRouter } = require("./controllers/users");

passport.use(localStrategy);

app.use("/books", bookRouter);
app.use("/google-books", googleBooksRouter);
app.use("/isbn-db", ISBNdbRouter);
app.use("/users", userRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.stack);
});

app.get("/", (req, res) => {
  console.log("Request made to root");
  res.status(200).send("Root");
});

app.listen(8000, () => {
  console.log("App is listening on port 8000 \nCORS enbabled");
});

// process.on("SIGINT", () => {
//   console.log("Bye bye!");
//   process.exit();
// });
