const express = require('express');
const router = express.Router();

const {
    showMenu,
    startOrder,
    makeOrder
} = require('..');

const { log } = require('../utils');

router.post('/command/menu', function (req, res, next) {
    try {
        const cafe = req.body.text? req.body.text : 'all';
        const slackReqObj = req.body;

        const response = showMenu({ cafe, slackReqObj });
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

router.post('/command/order', function (req, res, next) {
    try {
        const cafe = req.body.text? req.body.text : undefined;
        const slackReqObj = req.body;

        const response = startOrder({ cafe, slackReqObj });
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

router.post('/actions', async (req, res) => {
    try {
        const slackReqObj = JSON.parse(req.body.payload);
        let response;

        switch (slackReqObj.callback_id) {
            case 'select_cafe':
                const cafe = slackReqObj.actions[0].value;
                response = startOrder({ cafe, slackReqObj });
                break;
            case 'order_lunch':
                response = makeOrder({ slackReqObj });
                break;
        }

        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;
