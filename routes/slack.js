var express = require('express');
var router = express.Router();

const {
    getMenu,
    orderSelectedFood
} = require('../src');

router.post('/command/menu', function (req, res, next) {
    try {
        const cafe = req.body.text? req.body.text : 'all';
        const slackReqObj = req.body;

        const response = getMenu({ cafe, slackReqObj });
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
            case 'order_selected':
                response = await orderSelectedFood({ slackReqObj });
                break;
        }

        return res.json(response);
    } catch (err) {
        log.error(err);
        return res.status(500).send('Something blew up. We\'re looking into it.');
    }
});

module.exports = router;
