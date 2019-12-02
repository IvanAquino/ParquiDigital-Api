const bcrypt = require('bcrypt')
const config = require('../config')

const hashPassword = (password) => {
    return bcrypt.hashSync(password, config.jwt.salt);
}

module.exports = hashPassword