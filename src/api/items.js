const express = require('express');
const router = express.Router();
const validate = require('validate.js');
const { verifyToken } = require('../utils/token');

const {
    getAll,
    search,
    searchAll,
    getById,
    create,
    update,
    updateMany,
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

router.get('/', verifyToken, (req, res) => {
    getAll('item')
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.get('/item/:id', verifyToken, (req, res) => {
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

router.post('/create', verifyToken, (req, res) => {
    const { name, price, vendor } = req.body;

    create('item', { name, price, vendor })
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res);
        });
});

router.post('/myItems', verifyToken, (req, res) => {
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

router.put('/update/edit', verifyToken, (req, res) => {
    const updates = req.body;

    update('item', updates._id, updates)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.put('/update', verifyToken, (req, res) => {
    const { active, inactive } = req.body;

    updateMany('item', active, 'active', true)
    .then(() => updateMany('item', inactive, 'active', false))
    .then(result => sendResults(res, result))
    .catch(err => {
        log.error(err);
        sendServerError(res, err);
    });
});

router.delete('/delete', verifyToken, (req, res) => {
    const { _id } = req.body;
    delete_('item', _id)
        .then(result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

module.exports = router;
