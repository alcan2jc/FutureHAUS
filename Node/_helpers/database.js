const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/FutureHAUS', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true  });

module.exports = {
    User: require('../schema/user.schema'),
};
