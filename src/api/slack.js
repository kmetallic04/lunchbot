const express   =   require('express');
const router    =   express.Router();

const {
    startOrder,
    showMenu,
    confirmOrder,
    startCheckout,
    formatMessage,
    cancelOrder
} = require('..');

const { log }   =   require('../utils');

router.post('/command/order', async function (req, res, next) {
    try {
        let response, slackReqObj;
        switch(req.body.text){
            case 'menu':
                response = await showMenu();
                break;
            default:
                const cafe = req.body.text? req.body.text : 'all';
                response = await startOrder(cafe);
        }
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

        if (slackReqObj.callback_id === 'pick_item') {
            response = await confirmOrder(slackReqObj);
        } else if (slackReqObj.callback_id == 'confirm_order') {
            const chosenOption = JSON.parse(slackReqObj.actions[0].value);
            console.log(chosenOption);
            const order = chosenOption.order;

            switch (chosenOption.action) {
                case 'cash':
                    response = formatMessage('Alright. Your order will be validated as soon as you give your cash to Irene.');
                    break;
                case 'other':
                    response = formatMessage("Consider updating your number on your slack profile to speed up the checkout process.");
                    break;
                case 'cancel':
                    cancelOrder(order._id);
                    response = formatMessage("This order has been canceled.");
                    break;
                case 'checkout':
                    const phone = chosenOption.phone;
                    startCheckout(order, phone);
                    response = formatMessage("Awesome. Accept the checkout prompt that you will receive on your mobile to validate your order.");
                    break;
            }
        }
        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;
