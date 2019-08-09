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

router.post('/create', verifyToken, (req, res) => {
    const details = req.body;
    const validationError = _validateParams(details);

    if (validationError) {
        return sendValidationError(res, validationError);
    }

    if (!(details.email || details.password || details.name || details.phone)) {
        return res.status(400).json({message: "All fields must be filled"});
    }

    search('vendor', 'email', details.email)
    .then((result) => {
        if (result) {
            return res.status(400).json({message: "Email is already in use"});
        } else {
            bcrypt.hash(details.password, bcrypt.genSaltSync(12))
            .then((hash) => {
                details.password = hash;
                return create('vendor', details);
            })
            .then((result) => sendResults(res, {
                    message: `User successfully created with email ${result.email}`
                })
            )
            .catch((err) => {
                log.error(err);
                sendServerError(res, err);
            });
        }
    })    
});

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    search('vendor', 'email', email)
    .then((user) => {
        if (!user)
            return res.status(400).json({message: "User has not been registered"});
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                log.error(err);
                return res.status(500).json({
                    message: "Oops something went wrong. Please try again after sometime"
                });
            }

            if (result) {
                const token = Token(result);
                return res.status(200).json({
                    message: "Login successful",
                    username: user.name,
                    token,
                })
            }

            return res.status(400).json({
                message: "Passwords do not match",
            })
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
