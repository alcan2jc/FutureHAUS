const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        username: { type: String, unique: true, required: true },
        hash: { type: String, required: true },
        role: {type: String, required: true}
    }
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
