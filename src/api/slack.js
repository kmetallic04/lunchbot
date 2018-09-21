const express   =   require('express');
const router    =   express.Router();

const {
    showMenu,
    confirmOrder,
    startCheckout,
    getNumber,
    formatMessage,
    cancelOrder
} = require('..');

const { log }   =   require('../utils');

router.post('/command/order', async function (req, res, next) {
    try {
        const cafe = req.body.text? req.body.text : 'all';
        const slackReqObj = req.body;

        const response = await showMenu({ cafe, slackReqObj });
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
            case 'pick_lunch_items':
                response = await confirmOrder(slackReqObj);
                break;
            case 'order_selected':
                const chosenOption = JSON.parse(slackReqObj.actions[0].value);
                const action = chosenOption.action;
                const order = chosenOption._doc;

                if (action == 'cash') {
                    response = formatMessage('Alright. Your order will be validated as soon as you give your cash to Irene.');
                }else if (action == 'other') {
                    //TO-DO Check slack dialogs to get number.
                    //console.log(await getNumber(slackReqObj));
                    response = formatMessage("Consider updating your number on your slack profile to speed up the checkout process.");
                }else if (action == 'checkout') {
                    const phone = chosenOption.phone;
                    startCheckout(order, phone);
                    response = formatMessage("Awesome. Accept the checkout prompt that you will receive on your mobile to validate your order.");
                }else if (action == 'cancel') {
                    cancelOrder(order._id);
                    response = formatMessage("Your order has been canceled.");
                }
                break;
        }
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;
