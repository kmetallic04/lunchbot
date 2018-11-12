const gateway       =   require('./gateway');
const { log }       =   require('.');

const sms = gateway.SMS;

const sendSMS = (options) => new Promise(async (resolve, reject) => {
    try {
        const { phone, message } = options;
        const result = await sms.send({
            'to'        : [ phone ],
            'message'   : message
        });
        resolve(result);
    } catch (err) {
        reject(err);
    }
});

module.exports = sendSMS;
