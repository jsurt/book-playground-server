const database = require("../../database");

const checkEmailAvailability = (req, res, next) => {
  const { email } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  database.query(sql, email, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      return next(error);
    }
    console.log(results);
    return next();
  });
};

const insertNewUser = (req, res, next) => {
  const { first_name, last_name, email } = req.body;
  const { hash } = res.locals;
  let sql =
    "INSERT INTO users (first_name, last_name, email, password, register_date) VALUES (?, ?, ?, ?, NOW())";
  let values = [first_name, last_name, email, hash];
  database.query(sql, values, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      return next(error);
    }
    return next();
  });
};

const getUserEmail = (req, res, next) => {
  const { email } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  database.query(sql, email, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      return next(error);
    }
    if (results.length < 1) {
      console.log("Email not found");
      const error = new Error("Email not found");
      return next(error);
    }
    res.locals.hash = results[0].password;
    return next();
  });
};

module.exports = { checkEmailAvailability, insertNewUser, getUserEmail };
