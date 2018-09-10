const   { log }         =   require('.');
const   gateway         =   require('./gateway');
let     currency        =   'KES';

async function payForMeal(vendor, phoneNumber, amount, order){
    return gateway.PAYMENT.mobileCheckout({
        productName     :   vendor,
        phoneNumber     :   phoneNumber,
        currencyCode    :   currency,
        amount          :   amount,
        metadata        :   {
            item        :   order.item,
            orderId     :   order._id, 
        }
    })
    .then(function(success){
        log.info(success);
    })
    .catch(function(err){
        log.error(err);
    });
}

module.exports = payForMeal;
