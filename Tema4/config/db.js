var mongoose = require('mongoose');
mongoose.connect(process.env.COSMOS_DB_CONNECTION_STRING)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;