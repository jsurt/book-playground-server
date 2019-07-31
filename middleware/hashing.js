const bcrypt = require("bcryptjs");

const hashPassword = (req, res, next) => {
    const { password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            console.log("hashing");
            console.log(err);
            res.locals.hash = hash;
            next();
        })
    })
}

const compareHash = (req, res, next) => {
    const { password } = req.body;
    const { hash } = res.locals;
        bcrypt.compare(password, hash, (err, result) => {
            if (!result) {
                throw new Error("Incorrect password");
            } else {
                console.log("Password is correct");
                next();
            }
        })
}

module.exports = { hashPassword, compareHash };