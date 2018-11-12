const express           =   require('express');
const router            =   express.Router();

const { log }           =   require('../utils');
const sendSMS           =   require('../utils/sms');
const { validateOrder } =   require('../utils/logic');
const { postRequest }   =   require('../utils/slack');

router.post('/lipa', async function (req, res) { 
    try{
        const responseUrl = req.body.requestMetadata.response_url;
        let message;
        
        if(req.body['status'] == 'Success'){
            const phone     =   req.body['source'];
            const value     =   req.body['value'];
            const vendor    =   req.body['productName'];
            const item      =   req.body.requestMetadata.item;
            const orderId   =   req.body.requestMetadata.orderId;
            message         =   `We have received your payment of ${value} to ${vendor} for ${item}.`;

            validateOrder(orderId, 'Mpesa');
            await sendSMS({ phone, message });
        }else{
            message = 'We were unable to initiate the mobile checkout. Try ordering again.';
        }

        postRequest(responseUrl, { text: message });
        res.status(200).send('OK');
    }catch(err){
        log.error(err);
    }
});

module.exports = router;
