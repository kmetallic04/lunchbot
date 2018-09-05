const { log }   =   require('./utils');
const axios     =   require('axios');
require('dotenv').load();

const {
    getAll,
    getById,
    create,
    update,
    delete_,
    search
} = require('./utils/models');

async function getMenu(options=null) {
    const filter = options? await search('vendor', 'name', options).then( (_vendor) => {
        return {vendor : _vendor._id};
    }): options;

    return await getAll('item', filter).then( result => {
        return result;
    });
}

async function showMenu(options) {
    
    //Add text and value fields for each menu item
    const fixMenu = (items) => {
        let _menu = [];
        items.forEach( item => {
            _menu.push({
                name: item.name,
                text: item.name + ': KES'+ item.price,
                value: item._id
            });
        });
        return _menu;
    };

    
    try {
        let response, menu, _text;
        const { cafe, slackReqObj } = options;

        if (cafe === 'all') {
            menu = await getMenu().then(fixMenu);
            _text = 'All menus'; 
        } else {
            menu = await getMenu(cafe).then(fixMenu);
            _text = `${cafe}'s menu.`;
        }
        
        response = {
            text: _text,
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
}

async function getSlackUser(userId){
    return await axios.get(
        'https://slack.com/api/users.profile.get',
        {
            params: {
                token: process.env.SLACK_TOKEN,
                user: userId
            }
        }
    ).then(function(user){
        return user.data.profile;
    }).catch(function(err){
        throw err;
    });
}

async function confirmOrder(slackReqObj){
    const itemObj = slackReqObj.actions[0].selected_options[0];
    const item = await getById('item', itemObj.value);
    const vendor = await getById('vendor', item.vendor);

    const user = await getSlackUser(slackReqObj.user.id);

    try{
        create('order', {
            person: {
                name: user.real_name
            },
            item: item._id,
            vendor: vendor._id,
            amount: item.price
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
                    value: 'checkout'
                },
                {
                    name: 'other',
                    text: 'No, I\'ll use a different number',
                    type: 'button',
                    value: 'other'
                },
                {
                    name: 'no',
                    text: 'Nah, I\'ll pay using cash',
                    type: 'button',
                    value: 'cash'
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
                    value: 'other'
                },
                {
                    name: 'no',
                    text: 'Nah, I\'ll pay using cash',
                    type: 'button',
                    value: 'cash'
                }]
            });
        }
        return response;
    }catch(err){
        throw err;
    }
}

async function processOrder(slackReqObj, phone = null){
    const user = await getSlackUser(slackReqObj.user.id);
    const totalCost = await getAll('order', {
        person: {
            name: user.real_name
        },
        paid: false
    }).then(function(orders){
        let price = 0;
        orders.forEach(function(order){
            price += order.amount;
        });
        return price;
    }).catch(function(err){
        console.log(err);
    });

    //To-do: Intitiate payment using this checkout.
    //paymentOptions.phoneNumber = phone | user.phone;
}

function formatMessage(message){
    return {
        attachments: [
            {
                title: message,
                color: '#2c963f',
                attachment_type: 'default'
            }
        ]
    };
}

//To-do: Fix dialog to prompt user to enter number or slack.
async function getNumber(slackReqObj){
    return await axios.post(
        'https://slack.com/api/dialog.open',
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
module.exports = { showMenu, confirmOrder, processOrder, getNumber, formatMessage};
