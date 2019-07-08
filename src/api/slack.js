const express = require('express');
const router = express.Router();

const {
    postResponse,
    getVendors,
    showMenu,
    startOrder,
    makeOrder,
    showOrder,
    toTitleCase
} = require('..');

const { log } = require('../utils');
var slackSession = {};

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

router.post('/command/vendors', function (req, res, next) {
    try {
        const response = getVendors();
        return res.json(response);
    } catch(err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it');
    }
});

router.post('/command/order', function (req, res, next) {
    try {
        const cafe = req.body.text? req.body.text : undefined;
        const slackReqObj = req.body;

        const response = startOrder();
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

router.post('/actions', async (req, res) => {
    try {
        const slackReqObj = JSON.parse(req.body.payload);
        let userId = slackReqObj.user.id;
        if (!slackSession.userId){
            slackSession.userId = {};
            slackSession.userId.username = slackReqObj.user.username.split('.').map(toTitleCase).join(' ');
        }
        let response;

        switch (slackReqObj.actions[0].action_id) {
            case 'pick_cafe':
                let cafe = slackReqObj.actions[0].selected_option.value;
                slackSession.userId.response_url = slackReqObj.response_url;
                response = showMenu(cafe);
                break;
            case 'make_order':
                slackSession.userId.response_url = slackReqObj.response_url;
                console.log(slackReqObj.actions[0].value);
                let order = JSON.parse(slackReqObj.actions[0].value);
                slackSession.userId.dish = order.dish;
                slackSession.userId.price = order.price;
                slackSession.userId.cafe = order.cafe;
                response = makeOrder(slackSession.userId);
                break;
            case 'confirm_order':
                response = showOrder(slackSession.userId);
        }
        return postResponse(slackSession.userId.response_url, response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;