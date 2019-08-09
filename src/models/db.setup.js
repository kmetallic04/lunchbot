const mongoose = require('mongoose');
require('dotenv').load();


const options = {
    useNewUrlParser: true,
    reconnectTries: 50,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
}

function connectDB(database) {
    mongoose.connect('mongodb://127.0.0.1:27017/' + database, options)
        .then(function () {
            console.log(database + ' connection successful');
        })
        .catch(function (error) {
            console.error.bind(console, database + ' connection unsuccessful, retrying in 5 seconds : ')
        });
    mongoose.Promise = global.Promise;

    return mongoose.connection;
}

module.exports = connectDB;