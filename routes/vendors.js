const express  = require('express');
const router   = express.Router();
const validate = require('validate.js')

const {
    getAll,
    search,
    create,
    update,
    delete_
} = require('../models/utils');

const {
    log,
    sendServerError,
    sendValidationError,
    sendResults
} = require('../src/utils');

const _validateParams = (params) => {
    let validationError;

    const constraints = {
        name: function (value) {
            if (value && !validate.isString(value)) {
                return {
                    format: {
                        message: 'must be a string'
                    }
                }
            }
            return {
                presence: {
                    message: 'is required'
                }
            }
        },
        phone: function (value) {

            if (validate.isEmpty(value)) {
                return {
                    presence: {
                        message: 'is required'
                    }
                };
            }
            if (!(/^\+\d{1,3}\d{3,}$/).test(value)) {
                return {
                    format: 'invalid phone number'
                };
            }

            return null;
        }
    }

    const error = validate(params, constraints);

    const makeErrorMessage = function (error) {
        let msg = "";
        for (let k in error) {
            msg += error[k] + "; ";
        }
        validationError = new Error(msg);
    }
    if (error) {
        makeErrorMessage(error)
    }
    return validationError;
}

router.get('/', (req, res) => {
    getAll('vendor')
        .then( result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.get('/vendor/:name', (req, res) => {
    const name = req.params.name;
    search('vendor', 'name', name)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.post('/create', (req, res) => {
    const details = req.body;
    const validationError = _validateParams(details);

    if (validationError) {
        return sendValidationError(res, validationError);
    }

    create('vendor', details)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.put('/edit/:id', (req, res) => {
    const updates = req.body;
    const id = req.params.id;
    const validationError = _validateParams(updates);

    if (validationError) {
        return sendValidationError(res, validationError);
    }

    update('vendor', id, updates)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    delete_('vendor', id)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

module.exports = router;
