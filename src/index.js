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

const startOrder = async cafe => {
    try {
        let response, menu, title;

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
                callback_id: 'pick_item',
                actions: [{
                    name: 'pick_item',
                    title: 'Pick an item',
                    text: 'Order',
                    type: 'select',
                    options: menu
                }],
            }]
        };
        return response;
    } catch (err) {
        log.error(err);
        return formatMessage("Sorry, I couldn't find that vendor. Could you try searching for a different vendor?");
    }
};

const showMenu = async () => {
    try {
        const vendors = await getAll('vendor');
        const items = await getAll('item');

        let response = {
            text: 'Available food items',
            attachments: []
        };

        //  Organise the menu by vendor
        vendors.map( vendor => {
            let fields = [
                {
                    title: 'Item',
                    short: true
                },
                {
                    title:  'Price',
                    short:  true
                }
            ];

            items.map( item => {
                if (item.vendor === vendor.name) {
                    fields.push(
                        {value: item.name, short: true},
                        {value: item.price, short: true}
                    );
                }
            });

            response.attachments.push({
                title:  (vendor.name + "'s menu.").toUpperCase(),
                color:  '#2c963f',
                fields: fields
            });
        });

        return response;
    } catch (err) {
        log.error(err);
        return formatMessage("I'm sorry, we encountered an error, could you try using this command again?");
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
                        order: order,
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
                callback_id: 'order_selected',
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
                        order: order,
                        action: 'cancel'
                    })
                }]
            });
        }
        return response;
    }catch(err){
        log.error(err);
        return formatMessage("I'm sorry, we encountered an error, could you try using this command again?");
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

module.exports = { startOrder, showMenu, confirmOrder, startCheckout, formatMessage, validateOrder, cancelOrder };
