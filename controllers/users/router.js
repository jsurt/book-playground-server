"use strict";
const database = require("../../database");
const express = require("express");

const router = express.Router();

const { checkEmailAvailability, insertNewUser, getUserEmail } = require("../../middleware/queries/users");
const { hashPassword, compareHash } = require("../../middleware/hashing");

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

router.post("/login", getUserEmail, compareHash, (req, res) => {
  res.send("Loggin in user");
});

module.exports = router;
