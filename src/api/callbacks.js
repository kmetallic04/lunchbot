const express           =   require('express');
const router            =   express.Router();

const { log }           =   require('../utils');
const sendSMS           =   require('../utils/sms');
const { validateOrder } =   require('../index');

router.post('/lipa', async function (req, res) { 
    try{
        if(req.body['status'] == 'Success'){
            phone   =   req.body['source'];
            value   =   req.body['value'];
            vendor  =   req.body['productName'];

            console.log(req.body);

            item    =   req.body.requestMetadata.item;
            orderId =   req.body.requestMetadata.orderId;

            message =   `We have received your payment of ${value} to ${vendor} for ${item}`;

            validateOrder(orderId);
            sendSMS({phone, message});
        }else{
            console.log(req.body);
        }
        res.status(200).send('OK');
    }catch(err){
        log.error(err);
    }
});

module.exports      =   router;
