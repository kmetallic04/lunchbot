const express = require('express');
const router = express.Router();

const {
    showMenu,
    startOrder,
    selectMore
} = require('..');

const { log } = require('../utils');

router.post('/command/menu', async function (req, res, next) {
    try {
        const cafe = req.body.text? req.body.text : 'all';
        req.cafe = cafe;
        const slackReqObj = req.body;

        const response = await showMenu({ cafe, slackReqObj });
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

        const cafe = req.cafe;
        let response;

        //remember to remove this line
        console.log(slackReqObj);

        switch (slackReqObj.callback_id) {
            case 'pick_lunch_items':
                const item = slackReqObj.actions[0].selected_options[0];
                req.items = req.items ? req.items.append(item) : [item];
                response = selectMore();
                break;
            case 'select_more':
                if(slackReqObj.actions[0].value == 'true'){
                    response = await showMenu({cafe, slackReqObj});
                }else{
                    //do something else
                    return res.json('Done.')
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
