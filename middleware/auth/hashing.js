const bcrypt = require("bcryptjs");

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      console.log("hashing");
      if (err) {
        const error = new Error(err);
        return next(error);
      }
      res.locals.hash = hash;
      next();
    });
  });
};

const compareHash = (req, res, next) => {
  const { password } = req.body;
  const { hash } = res.locals;
  bcrypt.compare(password, hash, (err, result) => {
    if (!result) {
      const error = new Error("Incorrect password");
      return next(error);
    }
    next();
  });
};

module.exports = { hashPassword, compareHash };
