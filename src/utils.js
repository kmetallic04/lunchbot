const morgan = require('morgan');
const tracer = require('tracer');

const log = (() => {
    const logger = tracer.colorConsole();
    logger.requestLogger = morgan('dev');
    return logger;
})();

const sendServerError = (res, error, message = null) => {
    return res.status(500).send({
        status: 500,
        message: message || 'Internal Server Error!',
        data: error
    });
}

const sendValidationError = (res, error, message = null) => {
    return res.status(400).send({
        status: 400,
        message: message || 'Bad request!',
        data: error
    });
}

module.exports = {
    log,
    sendServerError,
    sendValidationError
}
