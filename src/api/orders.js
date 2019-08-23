const express = require('express');
const router = express.Router();
const validate = require('validate.js')
const { verifyToken } = require('../utils/token');

const {
    getAll,
    getById,
    create,
    update,
    delete_,
    customGetOrders,
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
        person: function (value) {
            if (validate.isEmpty(value)) {
                return {
                    presence: {
                        message: 'is required'
                    }
                };
            }
            if (!validate.isObject(value)) {
                return {
                    format: 'must be an object'
                }
            }
            return null;
        },
        item: {
            presence: {
                message: 'is required'
            }
        },
        vendor: {
            presence: {
                message: 'is required'
            }
        },
        amount: function (value) {
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
        paid: function (value) {
            if (!validate.isBoolean(value)) {
                return {
                    format: 'must be a boolean'
                }
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

router.get('/', verifyToken, (req, res) => {
    getAll('order')
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.get('/order/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    getById('order', id)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.post('/myOrders', verifyToken, (req, res) => {
    const { vendor } = req.body;

    customGetOrders(vendor)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.post('/create', verifyToken, (req, res) => {
    const details = req.body;
    const validationError = _validateParams(details);

    if (validationError) {
        return sendValidationError(res, validationError);
    }

    create('order', details)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.put('/edit/:id', verifyToken, (req, res) => {
    const updates = req.body;
    const id = req.params.id;
    const validationError = _validateParams(updates);

    if (validationError) {
        return sendValidationError(res, validationError);
    }

    update('order', id, updates)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    delete_('order', id)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

module.exports = router;
