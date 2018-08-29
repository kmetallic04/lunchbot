const morgan  = require('morgan');
const tracer  = require('tracer');
const dbSetup = require('../models/db.setup');
require('dotenv').load();

const log = (() => {
    const logger = tracer.colorConsole();
    logger.requestLogger = morgan('dev');
    return logger;
})();

const selectDb = () => {
    let db;
    switch (process.env.NODE_ENV) {
        case 'test':
            db = dbSetup('menu-test');
            break;
        case 'development':
            db = dbSetup('menu-development');
            break;
        default:
            db = dbSetup('menu');
    }
    return db;
}

const sendServerError = (res, error, message = null) => {
    return res.status(500).send({
        status: 500,
        message: message || 'Internal Server Error!'
    });
}

const sendValidationError = (res, error, message = null) => {
    return res.status(400).send({
        status: 400,
        message: message || 'Bad request!',
        data: error
    });
}

const sendResults = (res, results, message = null) => {
    return res.status(200).send({
        status: 200,
        message: message || 'Success',
        data: results
    });
}

module.exports = {
    log,
    selectDb,
    sendServerError,
    sendValidationError,
    sendResults
}
