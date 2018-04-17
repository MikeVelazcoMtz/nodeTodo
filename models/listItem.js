var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listItemSchema = Schema({
    _id: Schema.Types.ObjectId,
    description: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('ListItem', listItemSchema);
