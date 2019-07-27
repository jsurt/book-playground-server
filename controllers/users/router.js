"use strict";
const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router();

const hashPassword = (req, res, next) => {
  bcrypt.genSalt(10, function(err, salt) {
    return bcrypt.hash(req.body.password, salt, function(err, hash) {
      console.log(req.body.password);
      // console.log(hash);
      next();
    });
    console.log("Password hashed");
  });
};

const insertUserToDb = (req, res, next) => {
  console.log("hello");
  next();
};

router.post("/signup", hashPassword, insertUserToDb, (req, res) => {
  res.status(201).send("Request made to /signup");
});

module.exports = { router };
