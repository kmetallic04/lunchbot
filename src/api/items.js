const express = require('express');
const router = express.Router();
const validate = require('validate.js');

const {
    getAll,
    search,
    searchAll,
    getById,
    create,
    update,
    delete_
} = require('../utils/models');

const {
    log,
    sendServerError,
    sendValidationError,
    sendResults
} = require('../utils');

const _validateParams = (params) => {
    let validationError;

    const constraints = {
        name: function (value) {
            if (validate.isEmpty(value)) {
                return {
                    presence: {
                        message: 'is required'
                    }
                };
            }
            if (!validate.isString(value)) {
                return {
                    format: 'must be a string'
                }
            }
            return null;
        },
        price: function (value) {
            if (validate.isEmpty(value)) {
                return {
                    presence: {
                        message: 'is required'
                    }
                };
            }
            if (!validate.isNumber(value)) {
                return {
                    format: 'must be a number.'
                };
            }
            return null;
        },
        vendor: {
            presence: {
                message: 'is required'
            }
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
    getAll('item')
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.get('/item/:id', (req, res) => {
    const id = req.params.id;
    getById('item', id)
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

    create('item', details)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res);
        });
});

router.post('/myItems', (req, res) => {
    const details = req.body;
    console.log(req.body);
    search('vendor', 'email', details.email)
        .then(result => searchAll('item', 'vendor', String(result._id)))
        .then(result => sendResults(res, result))
        .catch(err => {
            log.error(err);
            sendServerError(res);
        });
});

router.put('/edit/:id', (req, res) => {
    const updates = req.body;
    const id = req.params.id;
    const validationError = _validateParams(updates);

    if (validationError) {
        return sendValidationError(res, validationError);
    }

    update('item', id, updates)
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
    delete_('item', id)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

module.exports = router;
