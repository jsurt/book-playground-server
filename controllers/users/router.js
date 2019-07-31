"use strict";

const database = require("../../database");
const express = require("express");
const passport = require("passport");

const router = express.Router();

const { localStrategy } = require("../../auth/strategies/local");
const {
  checkEmailAvailability,
  insertNewUser,
  getUserEmail
} = require("../../middleware/queries/users");
const { hashPassword, compareHash } = require("../../middleware/auth/hashing");

const localAuth = passport.authenticate("local", {
  session: "false",
  failWithError: true
});

router.post(
  "/signup",
  checkEmailAvailability,
  hashPassword,
  insertNewUser,
  (req, res) => {
    console.log(res.locals.hash);
    res.status(201).send("User signed up");
  }
);

router.post("/login", localAuth, (req, res) => {
  res.status(201).send("Logging user in");
});

module.exports = router;
