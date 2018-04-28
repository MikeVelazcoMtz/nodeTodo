var mongoose = require('mongoose')
var Schema = mongoose.Schema

var listItemSchema = Schema({
  description: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('ListItem', listItemSchema)
