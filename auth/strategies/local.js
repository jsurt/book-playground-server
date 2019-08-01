"use strict";

const bcrypt = require("bcryptjs");
const database = require("../../database");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

const { getUserEmail } = require("../../middleware/queries/users");

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  (email, password, done) => {
    let sql = "SELECT * FROM users WHERE email = ?";
    database.query(sql, email, (error, results, fields) => {
      if (error) {
        console.error("Email not found");
        return done(null, false, error);
      }
      if (results.length < 1) {
        const error = new Error("Email not found");
        return done(null, false, error);
      }
      const user = results[0];
      const hash = user.password;
      bcrypt.compare(password, hash, (err, result) => {
        if (!result) {
          const error = new Error("Incorrect password");
          return done(null, false, error);
        }
        console.log(results[0], "test");
        return done(null, results[0]);
      });
    });
  }
);

module.exports = { localStrategy };
