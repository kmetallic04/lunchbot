let bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    conf = require('./config');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let gatewayoptions = {
    username: conf.username,
    apiKey: conf.apikey,
    format: "json"
}
let paymentOptions = {
    product: conf.product_name,
    currencyCode: conf.currency
}
let Africastalking = require('africastalking')(gatewayoptions);

// USSD Logic 
app.post('/ussd', new Africastalking.USSD((params, next) => {
    // Initial Menu
    var endSession = false; 
    let phone = params.phoneNumber.toString();
    var message = '';
    if (params.text === '') {
        message = `Hey there ${phone} Kibanda is requesting you to pay for your meal \n`;
        message += "1.Mobile checkout\n";
        message += "2. Pay cash \n";
        endSession = false;
    } else if (params.text === '1') { // Option One
        message = "1.Accept\n";
        message += "2.Cancel \n";
        endSession = false;
    } else if (params.text === '1*1') {
        message = "We're processing your payment \n";
        endSession = true;
        paymentOptions.phoneNumber = phone;
        paymentOptions.amount = tamount;
        next({
            response: message,
            endSession: endSession
        });
        setTimeout(function() {
            payments.checkout(paymentOptions)
                .then((success) => {})
                .catch((error) => {
                    console.log(error);
                });
        }, 5000);
    } else if (params.text === '1*2') {
        message = "Order Cancelled\n";
        endSession = true;
                    
    } else if (params.text === '2') { // Option  2
        message = "Pay with cash at Delivery  \n";
        endSession = true;
    }
}));

// Payments Call Back
app.post('/lipa', (req, res) => {
    let sms = Africastalking.SMS;
    let opts = {};
    if (req.body["status"] === "Success") {
        // Send User a confirmation Message.
        opts.to = req.body['phoneNumber'];
        opts.message = `We have recived your payment of Ksh.${req.body['amount']}`;
        sms.send(opts).then((success) => {}).catch((error) => { console.log(error) });
    } else {
    
        console.log(req.body);
    }
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('Green Light');
});

app.listen(3000, function(server) {
    console.log('Good to Go');
});