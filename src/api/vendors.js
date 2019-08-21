const router  = require('express').Router();
const validate = require('validate.js');
const { Token, verifyToken } = require('../utils/token');
const bcrypt = require('bcrypt');

const {
    getAll,
    search,
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

var sessions = {};

const _validateParams = (params) => {
    let validationError;

    const constraints = {
        email: {
            presence: {
                message: "is required"
            },
            format: {
                pattern:"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
                flags:"i",
                message:"invalid format",
            }
        },
        password: {
            presence: true,
        },
        name: {
            presence: {
                message: "is required"
            },
        },
        phone: { 
            presence: {
                message: "is required"
            },
        },
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
    getAll('vendor')
        .then( result => {
            sendResults(res, result);
        })
        .catch(err => {
            log.error(err);
            sendServerError(res, err);
        });
});

router.get('/:name', (req, res) => {
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

    if (!(details.email || details.password || details.name || details.phone)) {
        return sendValidationError(res, 
            'Empty Fields', 
            'Please fill out all the details'
        );
    }

    search('vendor', 'email', details.email)
    .then((result) => {
        if (result)
            sendValidationError(res, 
                'Registered Email', 
                'Email already in use...'
            );
        bcrypt.hash(details.password, bcrypt.genSaltSync(12))
        .then((hash) => {
            details.password = hash;
            return create('vendor', details);
        })
        .then((result) => sendResults(res, {
                message: result.email,
            }, 
            `User successfully created with email ${result.email}`
            )
        )
        .catch((err) => {
            log.error(err);
            sendServerError(res, err);
        });
    })    
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    search('vendor', 'email', email)
    .then((user) => {
        if (!user)
            return sendValidationError(res, 
                'Unregistered User', 
                'User has not been registered!'
            );
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                log.error(err);
                return sendServerError(res, err);
            }

            if (result) {
                const token = Token(result);
                return sendResults(res, {
                    email: user.email,
                    name: user.name,
                    vendor: user._id,
                    token,
                }, 'Login Successful');
            }

            return sendValidationError(res, 
                'Invalid Password', 
                'Passwords do not match, please try again...'
            );
        });
    })
    .catch(err => {
        log.error(err);
        sendServerError(res, err);
    })
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
