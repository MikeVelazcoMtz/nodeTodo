var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Password = require('../util/password')

var UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  items: [{type: Schema.Types.ObjectId, ref: 'ListItem'}]
})

UserSchema.pre('save', function (next) {
  var user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  try {
    user.password = Password.hash(user.password)
  } catch (err) {
    next(err)
  }

  next()
})

module.exports = mongoose.model('User', UserSchema)
