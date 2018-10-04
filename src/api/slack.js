const express   =   require('express');
const router    =   express.Router();

const {
    selectVendor,
    startOrder,
    confirmOrder,
    checkout,
    formatMessage,
    enterNumber
} = require('../utils/logic');

const { create } = require('../utils/models');

const { log }   =   require('../utils');

router.post('/command/order', async function (req, res, next) {
    try {
        let response = await selectVendor(req.body);
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

router.post('/actions', async (req, res) => {
    try {
        let response;
        const slackReqObj = JSON.parse(req.body.payload);

        if (slackReqObj.callback_id === 'pick_items') {
            confirmOrder(slackReqObj);
        }else if (slackReqObj.callback_id === 'select_vendor') {
            startOrder(slackReqObj);
        } else if (slackReqObj.callback_id === 'confirm_order') {
            const chosenOption = JSON.parse(slackReqObj.actions[0].value);
            const order = chosenOption.order;
              
            switch (chosenOption.action) {
                case 'cash':
                    create('order', order);
                    response = formatMessage('Alright. Your order will be validated as soon as you give your cash to Irene.');
                    return res.json(response);
                case 'other':
                    enterNumber(slackReqObj, order);
                    break;
                case 'checkout':
                    checkout(order, chosenOption.phone, slackReqObj.response_url);
                    break;
            }
        } else if (slackReqObj.callback_id === 'enter_number') {
            const order = JSON.parse(slackReqObj.state);
            const phone = slackReqObj.submission.phone;
            checkout(order, phone, slackReqObj.response_url);
        }

        return res.status(200).send();
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;
