const { log } = require('./utils');
const {
    getAll,
    getById,
    create,
    update,
    delete_
} = require('./utils/models');

// TODO: Get all menu items or filter by a specific menu.

function getMenu(options=null) {
    let filter = options? {vendor: options}: options;
    return getAll('item', filter).then( result => {
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
        console.log(_menu);
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

function startOrder (options) {

    try {
        const { cafe, slackReqObj } = options;
        const cafeOptions = [
            {
                text: 'Bobs',
                value: 'bobs'
            },
            {
                text: 'Kibanda',
                value: 'kibanda'
            }
        ];
        let response;

        if (cafe === undefined) {
            response = {
                text: 'All menus',
                attachments: [{
                    text: 'Select Cafe',
                    fallback: 'Select Cafe',
                    color: '#2c963f',
                    mrkdwn: true,
                    mrkdwn_in: ['text'],
                    attachment_type: 'default',
                    callback_id: 'select_cafe',
                    actions: [
                        {
                            name: 'kibandaCafe',
                            text: 'Kibanda',
                            type: 'button',
                            value: 'kibanda'
                        },
                        {
                            name: 'bobsCafe',
                            text: 'Bobs',
                            type: 'button',
                            value: 'bobs'
                        }
                    ],
                }]
            }
        } else {

            if (cafe === 'bobs') {
                response = {
                    text: `Bobs menu.`,
                    mrkdwn: true,
                    mrkdwn_in: ['text'],
                    attachments: [{
                        text: 'Select Item',
                        fallback: 'Select Item',
                        color: '#2c963f',
                        mrkdwn: true,
                        mrkdwn_in: ['text'],
                        attachment_type: 'default',
                        callback_id: 'order_lunch',
                        actions: [{
                            name: 'pick_lunch_items',
                            title: 'Make an order',
                            text: 'Order',
                            type: 'select',
                            options: getMenu({cafe, slackReqObj })
                        }],
                    }]
                }
            } else {
                response = {
                    text: `Kibandas menu.`,
                    mrkdwn: true,
                    mrkdwn_in: ['text'],
                    attachments: [{
                        text: 'Select Item',
                        fallback: 'Select Item',
                        color: '#2c963f',
                        mrkdwn: true,
                        mrkdwn_in: ['text'],
                        attachment_type: 'default',
                        callback_id: 'order_lunch',
                        actions: [{
                            name: 'pick_lunch_items',
                            title: 'Make an order',
                            text: 'Order',
                            type: 'select',
                            options: getMenu({ cafe, slackReqObj })
                        }],
                    }]
                }
            }
        }
        return response;
    } catch (err) {
        throw err;
    }
}

function selectMore () {
    return {
        text: 'Order taken',
        attachments: [{
            text: 'Would you like to order anything else?',
            fallback: 'Would you like to order anything else?',
            color: '#2c963f',
            mrkdwn: true,
            mrkdwn_in: ['text'],
            attachment_type: 'default',
            callback_id: 'select_more',
            actions: [
                {
                    name: 'addMore',
                    text: 'Sure',
                    type: 'button',
                    value: 'true'
                },
                {
                    name: 'checkout',
                    text: 'Nah',
                    type: 'button',
                    value: 'false'
                }
            ],
        }]
    };
}

module.exports = { showMenu, startOrder, selectMore };
