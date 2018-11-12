const   { log }         =   require('.');
const   gateway         =   require('./gateway');
let     currency        =   'KES';

const payForMeal = (phoneNumber, amount, order , responseUrl) => new Promise( async (resolve, reject) => {
    try {
        const result = await gateway.PAYMENT.mobileCheckout({
            productName     :   'Lunch',
            phoneNumber     :   phoneNumber,
            currencyCode    :   currency,
            amount          :   amount,
            metadata        :   {
                item        :   order.item,
                orderId     :   order._id,
                response_url:   responseUrl
            }
        });
        if (result.status === 'PendingConfirmation')
            resolve(result);
        else
            reject(result);
    } catch (err) {
        reject(err);
    }
});

module.exports = payForMeal;
