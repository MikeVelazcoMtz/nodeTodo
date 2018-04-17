var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: Schema.Types.ObjectId,
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
});

module.exports = mongoose.model('User', userSchema);
