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
    if (results.length > 0) {
      throw new Error("Email already taken");
    }
    next();
  });
};

module.exports = { checkEmailAvailability };
