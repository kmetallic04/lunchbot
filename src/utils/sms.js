const gateway       =   require('./gateway');
const { log }       =   require('.');

const sms = gateway.SMS;

const sendSMS = async options => {
    const {phone, message} = options;
    sms.send({
        'to'        : phone,
        'message'   : message
    })
    .then(success => {
        log.info('SMS sent successfully.');
    })
    .catch(err => {
        log.error(err);
    });
};

module.exports = sendSMS;
