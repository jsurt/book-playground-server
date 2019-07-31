const database = require("../../database");

const checkEmailAvailability = (req, res, next) => {
  const { email } = req.body;
  let queryStr = "SELECT * FROM users WHERE email = ?";
  let values = email;
  database.query(queryStr, values, (error, results, fields) => {
    if (error) {
      console.log(error);
      throw new Error(error);
    }
    console.log(results);
    next();
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
      next(error);
    }
    next();
  });
};

const getUserEmail = (req, res, next) => {
  const { email } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  database.query(sql, email, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      next(error);
    }
    res.locals.hash = results[0].password;
    next();
  });
};

module.exports = { checkEmailAvailability, insertNewUser, getUserEmail };
