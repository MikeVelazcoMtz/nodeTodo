var bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

module.exports = {
  hash: function (password) {
    try {
      return bcrypt.hashSync(password, SALT_WORK_FACTOR)
    } catch (err) {
      return false
    }
  },
  compare: function (password, hashed) {
    try {
      return bcrypt.compareSync(password, hashed)
    } catch (err) {
      return false
    }
  }
}
