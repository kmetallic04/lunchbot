require('dotenv').load();

const { log }   =   require('./utils');
const axios     =   require('axios');
const pay       =   require('./utils/payment');
const sms       =   require('./utils/sms');

const       {
    getAll,
    getById,
    create,
    update,
    delete_,
    search
} = require('./utils/models');

const getMenu   =   async (name=null) => {
    let filter  =   {};
    if (name) {
        await search('vendor', 'name', name)
            .then(vendor => {
                filter = {vendor : vendor.name};
            })
            .catch(err => {
                log.error(err);
            });
    }
    return await getAll('item', filter);
};

const formatMenu = async (items = []) => {
    let menu = items.map(item => {
        return {
            name: item.name,
            text: item.name + ': KES'+ item.price,
            value: JSON.stringify(item)
        };
    });
    return menu;
};

const showMenu = async (options) => {
    try {
        let response, menu, title;
        const {
            cafe,
            slackReqObj
        } = options;

        if (cafe === 'all') {
            menu = await getMenu();
            title = 'All menus';
        } else {
            menu = await getMenu(cafe);
            title = `${cafe}'s menu.`;
        }
        menu = await formatMenu(menu);

        response = {
            text: title,
            attachments: [{
                text: 'Select item',
                fallback: 'Select item',
                color: '#2c963f',
                mrkdwn: true,
                mrkdwn_in: ['text'],
                attachment_type: 'default',
                callback_id: 'pick_lunch_items',
                actions: [{
                    name: 'pick_lunch_items',
                    title: 'Pick an item',
                    text: 'Order',
                    type: 'select',
                    options: menu
                }],
            }]
        };
        return response;
    } catch (err) {
        throw err;
    }
};

const getSlackUser = async (userId) => {
    const user = await axios.get(
        process.env.SLACK_URI + 'users.profile.get',
        {
            params: {
                token: process.env.SLACK_TOKEN,
                user: userId
            }
        })
        .then(user => {
            return user.data.profile;
        })
        .catch(err => {
            log.error(err);
        });
    return user;
};

const confirmOrder = async (slackReqObj) => {
    const itemString = slackReqObj.actions[0].selected_options[0].value;
    const item = JSON.parse(itemString);

    const user = await getSlackUser(slackReqObj.user.id);

    try{
        const order = await create('order', {
                person: {
                    name: user.real_name
                },
                item    : item.name,
                vendor  : item.vendor,
                amount  : item.price
            });

        let response = {
            text: 'Order received!',
            attachments: [{
                color: '#2c963f',
                fields: [
                    {
                        title: 'Item',
                        value: item.name,
                        short: true
                    },
                    {
                        title: 'Price',
                        value: 'KES ' + item.price,
                        short: true
                    }
                ],
            }]
        };

        if(user.phone){
            response.attachments.push({
                title: 'Proceed to checkout with this number: ' + user.phone + ' ?',
                short: false,
                color: '#2c963f',
                attachment_type: 'default',
                callback_id: 'order_selected',
                actions: [{
                    name: 'yes',
                    text: 'Sure',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'checkout', phone: user.phone}})
                },
                {
                    name: 'other',
                    text: 'No, I\'ll use a different number',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'other'}})
                },
                {
                    name: 'no',
                    text: 'Nah, I\'ll pay using cash',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'cash'}})
                },
                {
                    name: 'cancel',
                    text: 'Cancel this order',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'cancel'}})
                }]
            });
        }else{
            response.attachments.push({
                title: 'Would you like to pay via mpesa or cash?',
                short: false,
                color: '#2c963f',
                attachment_type: 'default',
                callback_id: 'order_selected',
                actions: [{
                    name: 'other',
                    text: 'Via Mpesa',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'other'}})
                },
                {
                    name: 'no',
                    text: 'Nah, I\'ll pay using cash',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'cash'}})
                },
                {
                    name: 'cancel',
                    text: 'Cancel this order',
                    type: 'button',
                    value: JSON.stringify({...order, ...{action: 'cancel'}})
                }]
            });
        }
        return response;
    }catch(err){
        throw err;
    }
};

const startCheckout = async (order, phone) => {
    const vendor = order.vendor;
    const amount = order.amount;
    pay(vendor, phone, amount, order);
};

const validateOrder = async orderId => {
    return update('order', orderId, updates = {
        paid: true
    })
    .then( () => {
        return 'Successfully updated.'
    })
    .catch( err => {
        log.error(err);
        return 'Update failed.'
    });
};

const cancelOrder = async (orderId) => {
    return delete_('order', orderId)
    .then(success => {
        return 'Order canceled.'
    })
    .catch( err => {
        log.error(err);
        return 'Order cancelling failed.'
    });
};

const formatMessage = message => {
    return {
        attachments: [
            {
                title: message,
                color: '#2c963f',
                attachment_type: 'default'
            }
        ]
    };
};

//To-do: Fix dialog to prompt user to enter number or slack.
async function getNumber(slackReqObj){
    return await axios.post(
        process.env.SLACK_URI + 'dialog.open',
        {
            trigger_id: slackReqObj.trigger_id,
            dialog: JSON.stringify({
                callback_id: "order_lunch",
                title: "Enter your phone number",
                submit_label: "Request",
                notify_on_cancel: true,
                elements: [
                {
                    type: "text",
                    label: "Mobile No.",
                    name: "phone",
                    subtype: 'tel'
                }]
            })
        },
        {
            headers: {
                Authorization: {
                    bearer: process.env.SLACK_TOKEN
                }
            }
        }
    ).then(function(result){
        return result;
    }).catch(function(err){
        throw err;
    });
}

module.exports = { showMenu, confirmOrder, startCheckout, getNumber, formatMessage, validateOrder, cancelOrder };
