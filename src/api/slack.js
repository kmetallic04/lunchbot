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

router.post('/command/vendors', async function (req, res, next) {
    try {
        const response = await getVendors();
        return res.json(response);
    } catch(err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it');
    }
});

router.post('/command/order', function (req, res, next) {
    try {
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
        if (!slackSession[userId]){
            slackSession[userId] = {};
            slackSession[userId].username = slackReqObj.user.username.split('.').map(toTitleCase).join(' ');
        }
        console.log(slackSession);
        let response;

        switch (slackReqObj.actions[0].action_id) {
            case 'start_order':
                response = startOrder();
                break;
            case 'pick_cafe':
                slackSession[userId].cafe = slackReqObj.actions[0].selected_option.value;
                slackSession[userId].cafe_init = slackSession[userId].cafe;
                slackSession[userId].response_url = slackReqObj.response_url;
                response = await showMenu(slackSession[userId].cafe);
                break;
            case 'make_order':
                slackSession[userId].response_url = slackReqObj.response_url;
                let order = JSON.parse(slackReqObj.actions[0].value);
                slackSession[userId].dish = order.dish;
                slackSession[userId].price = order.price;
                slackSession[userId].cafe = order.cafe;
                slackSession[userId].item_id = order.item_id;
                slackSession[userId].vendor_id = order.vendor_id;
                response = makeOrder(slackSession[userId]);
                break;
            case 'confirm_order':
                response = await showOrder(slackSession[userId]);
                slackSession[userId].response_url = slackReqObj.response_url;
                break;
            case 'not_confirm_order':
                response = await showMenu(slackSession[userId].cafe_init);
                slackSession[userId].response_url = slackReqObj.response_url;
                break;
        }
        return postResponse(slackSession[userId].response_url, response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;