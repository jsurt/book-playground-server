const bcrypt = require("bcryptjs");

const hashPassword = password => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            console.log("hashing");
            return hash;
        })
    })
}

module.exports = { hashPassword };