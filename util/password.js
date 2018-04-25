var bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

module.exports = {
  hash: function (password) {
    return bcrypt.hashSync(password, SALT_WORK_FACTOR)
  },
  compare: function (password, hashed) {
    return bcrypt.compareSync(password, hashed)
  }
}
