"use strict";
const bcrypt = require("bcryptjs");
const database = require("../../database");
const express = require("express");

const router = express.Router();

const { hashPassword } = require("../../middleware/hashing");

const { checkEmailAvailability } = require("../../middleware/queries/users");

// console.log(hashPassword("test"));
// const password = bcrypt.hash("password", 8, (err, hash) => {
//     console.log(hash);
// })

// console.log(password);

const getHash = (req, res, next) => {
  const { password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      // console.log(hash, "Hash with salt");
      res.locals.hash = hash;
      next();
    });
  });
};

// const checkEmailAvailability = (req, res, next) => {
//   const { email } = req.body;
//   let sql = "SELECT * FROM users WHERE email = ?";
//   let values = email;
//   try {
//     database.query(sql, values, (error, results, fields) => {
//       if (error) {
//         console.log(error);
//         next(error);
//       }
//       if (results.length > 0) {
//         console.log("Email is unavailable");
//         throw new Error("Email is unavailable");
//       }
//       if (results.length < 1) {
//         console.log("Email is available");
//       }
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const insertUser = (req, res, next) => {
  const { first_name, last_name, email } = req.body;
  const { hash } = res.locals;
  let sql =
    "INSERT INTO users (first_name, last_name, email, password, register_date) VALUES (?, ?, ?, ?, NOW())";
  let values = [first_name, last_name, email, hash];
  database.query(sql, values, (error, results, fields) => {
    if (error) {
      next(error);
    }
    next();
  });
};

const findUserInDatabase = (req, res, next) => {
  const { email, password } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  let values = email;
  try {
    database.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Server error");
      }
      let hash = results[0].password;
      console.log(hash);
      bcrypt.compare(password, hash, (err, result) => {
        if (!result) {
          return res.status(401).send("Incorrect password");
        } else {
          console.log("True");
          next();
        }
      });
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

router.post(
  "/signup",
  checkEmailAvailability,
  getHash,
  insertUser,
  (req, res) => {
    console.log(res.locals.hash);
    res.status(201).send("User signed up");
  }
);

router.post("/login", findUserInDatabase, (req, res) => {
  res.send("Loggin in user");
});

module.exports = router;
