require('dotenv').load();
const request   =   require('request');

const { log }   =   require('.');
const pay       =   require('./payment');

const { 
    postRequest,
    getRequest
} = require('./slack');

const {
    getAll,
    getById,
    create,
    update,
    delete_,
    search
} = require('./models');

const selectVendor = async (slackReqObj) => {
    try{
        const vendors = await getAll('vendor')
        .then(vendors => {
            return vendors.map(vendor => {
                return {
                    'text': vendor.name,
                    'value': vendor.name
                };
            });
        });

        let response = {
            text: 'Select a vendor to order from',
            attachments: [{
                color: '#2c963f',
                mrkdwn: true,
                mrkdwn_in: ['text'],
                attachment_type: 'default',
                callback_id: 'select_vendor',
                actions: [{
                    name: 'select_vendor',
                    title: 'Pick a vendor',
                    text: 'Vendor',
                    type: 'select',
                    options: vendors
                }],
            }]
        };
        return response;
    } catch (err) {
        log.error(err);
    }
};

const getMenu = async (name=null) => {
    let filter = {};
    if (name) {
        await search('vendor', 'name', name)
            .then(vendor => {
                filter = {vendor : vendor.name};
            });
    }
    return await getAll('item', filter);
};

const startOrder = async (slackReqObj) => {
    try {
        const vendor = slackReqObj.actions[0].selected_options[0].value;
        const trigger_id = slackReqObj.trigger_id;

        let menu = await getAll('item', {vendor: vendor});

        menu = menu.map( item => {
            return {
                label       : item.name + ' -- Ksh.' + item.price,
                value       : JSON.stringify({ 
                    name    : item.name,
                    price   : item.price
                }),
                category    : item.category
            };
        });

        const body = {
            trigger_id      : trigger_id,
            dialog          : {
                callback_id     : 'pick_items',
                title           : 'Order Lunch',
                submit_label    : 'Order',
                state           : vendor,
                elements        : [
                    {
                        label   : 'Main meal',
                        name    : 'Starch',
                        type    : 'select',
                        short   : false,
                        options : menu.filter(item => item.category === 'Starch')
                    },
                    {
                        label   : 'Stew',
                        name    : 'Stew',
                        type    : 'select',
                        short   : true,
                        options : menu.filter(item => item.category === 'Stew'),
                        optional: true
                    },
                    {
                        label   : 'Extras',
                        name    : 'Others',
                        type    : 'select',
                        short   : true,
                        options : menu.filter(item => item.category === 'Others'),
                        optional: true
                    },
                    {
                        label   : 'Drinks',
                        name    : 'Drinks',
                        type    : 'select',
                        short   : true,
                        options : menu.filter(item => item.category === 'Drinks'),
                        optional: true
                    }
                ]
            }
        };

        postRequest(process.env.SLACK_DIALOG_URI, body);
        
    } catch (err) {
        log.error(err);
    }
};

const confirmOrder = async (slackReqObj) => {
    const orderList = slackReqObj.submission;

    const user = await getRequest(
        process.env.SLACK_PROFILE_URI,
        slackReqObj.user.id
    ).then( user => user.profile);

    try{
        let response = {
            response_type: 'ephemeral',
            replace_original: true,
            attachments: [{
                color: '#2c963f',
                fields: [
                    {
                        title: 'Items',
                        short: true
                    },
                    {
                        title: 'Price',
                        short: true
                    }
                ],
            }]
        };

        let amount = 0;
        let order = [];

        Object.entries(orderList).map( ([key, value]) => {
            if (value !== null) {
                value = JSON.parse(value);
                order.push(value.name);
                amount += value.price;
            } 
        });

        order = {
            person  : { name: user.real_name},
            item    : order.toString(),
            vendor  : slackReqObj.state,
            amount  : amount
        };

        response.attachments[0].fields.push({
            value: order.item,
            short: true
        },{
            value: 'KES '  + amount,
            short: true
        });

        if(user.phone){
            response.attachments.push({
                text: 'Proceed to checkout with this number: ' + user.phone + ' ?',
                short: false,
                color: '#2c963f',
                attachment_type: 'default',
                callback_id: 'confirm_order',
                actions: [{
                    name: 'yes',
                    text: 'Sure',
                    type: 'button',
                    value: JSON.stringify({
                        order: order,
                        action: 'checkout',
                        phone: user.phone
                    })
                },
                {
                    name: 'other',
                    text: 'No, I\'ll use a different number',
                    type: 'button',
                    value: JSON.stringify({
                        order: order,
                        action: 'other'
                    })
                },
                {
                    name: 'no',
                    text: 'Nah, I\'ll pay using cash',
                    type: 'button',
                    value: JSON.stringify({
                        order: order,
                        action: 'cash'
                    })
                },
                {
                    name: 'cancel',
                    text: 'Cancel this order',
                    type: 'button',
                    value: JSON.stringify({
                        action: 'cancel'
                    })
                }]
            });
        }else{
            response.attachments.push({
                title: 'Would you like to pay via mpesa or cash?',
                short: false,
                color: '#2c963f',
                attachment_type: 'default',
                callback_id: 'confirm order',
                actions: [{
                    name: 'other',
                    text: 'Via Mpesa',
                    type: 'button',
                    value: JSON.stringify({
                        order: order,
                        action: 'other'
                    })
                },
                {
                    name: 'no',
                    text: 'Nah, I\'ll pay using cash',
                    type: 'button',
                    value: JSON.stringify({
                        order: order,
                        action: 'cash'
                    })
                },
                {
                    name: 'cancel',
                    text: 'Cancel this order',
                    type: 'button',
                    value: JSON.stringify({
                        action: 'cancel'
                    })
                }]
            });
        }

        postRequest(slackReqObj.response_url, response);

    }catch(err){
        log.error(err);
        return formatMessage("I'm sorry, we encountered an error, could you try using this command again?");
    }
};

const enterNumber = async (slackReqObj, order) => {
    try{
        const body = {
            trigger_id: slackReqObj.trigger_id,
            dialog: {
                callback_id     : 'enter_number',
                title           : 'Phone number',
                state           : JSON.stringify(order),
                notify_on_cancel: false,
                submit_label    : 'Proceed',
                elements        : [{
                    label       : 'Enter your phone number',
                    name        : 'phone',
                    type        : 'text',
                    subtype     : 'tel',
                    min_length  : 10
                }]
            }
        };

        postRequest(process.env.SLACK_DIALOG_URI, body);

    } catch (err) {
        log.error(err);
    }
};

const checkout = async (order, phone, response_url) => {
    try{
        phone = phone.replace(/ /g, '');

        if (!(/^\+\d{1,3}\d{3,}$/).test(phone)) {
            // Phone number is not valid.

            if ( phone.startsWith('0') ){
                phone = phone.replace('0', '+254');
            } else if (phone.startsWith('254')){
                phone = '+' + phone;
            } else {
                throw 'Your phone number could not be validated.';
            }
        }
        
        await pay(phone, order.amount, order, response_url);
        await create('order', order);

        const response = formatMessage("Awesome. Accept the checkout prompt that you will receive on your mobile to validate your order.");
        postRequest(response_url, response);

    } catch (err) {
        log.error(err);
        const response = formatMessage(err);
        postRequest(response_url, response);
    }
};

const validateOrder = async (orderId, means, responseUrl) => {
    try {
        update('order', orderId, updates = {
            status: {
                paid    : true,
                means   : means
            }
        });
    } catch (err) {
        log.error(err);
    }
};

const formatMessage = message => {
    return {
        response_type: 'ephemeral',
        replace_original: true,
        delete_top : true,
        text: message
    };
};

module.exports = { selectVendor, startOrder, confirmOrder, checkout, formatMessage, validateOrder, enterNumber };
