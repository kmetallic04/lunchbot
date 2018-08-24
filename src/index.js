const { log } = require('./utils');

// TODO: set up db

function getMenu(options) {
    // TODO: return specific menu from db
}

function showMenu(options) {

    // placeholder
    const menu = {
        bobsMenu: [
            {
                text: 'Rice Beef: 300',
                value: 1,
            },
            {
                text: 'Ugali managu: 180',
                value: 2,
            },
        ],
        marionsMenu: [
            {
                text: 'Rice Beef: 300',
                value: 1,
            },
            {
                text: 'Ugali managu: 180',
                value: 2,
            },
        ]
    }
    function markDownMenu(menu) {
        let formattedMenu;
        Objects.options(menu)
            .forEach(([key, value]) => {
                console.log(key, value);
            });
        return formattedMenu;
    }

    try {
        let response, menuSelected;
        const { cafe, slackReqObj } = options;

        if (cafe === 'all') {
            menuSelected = menu;
            // create a response with all the menus
            response = {
                text: 'All menus',
                attachments: [{
                    text: markDownMenu,
                    fallback: markDownMenu,
                    color: '#2c963f',
                    mrkdwn: true,
                    mrkdwn_in: ['text'],
                    attachment_type: 'default',
                    callback_id: 'order_selected',
                    actions: [{
                        name: 'pick_lunch_items',
                        title: 'Make an order',
                        text: 'Order',
                        type: 'button',
                    }],
                }]
            }
        } else {
            const vendors = ['bobs', 'marions'];

            if (!vendors.includes(cafe.toLowerCase())) {
                const slackReqObjString = JSON.stringify(slackReqObj);
                log.error(new Error(`Cafe ${cafe} selected is not among the current lunch delivery partners. slackReqObj: ${slackReqObjString}`));

                const text = 'Hmmm, Currently, you can only order lunch from BOB or MARION\'s cafes.\n\nTry `/order bobs` or `/order marions` \n\nTo see the menus, try `/menu` or `/menu bobs` or `/menu marions`';
                response = {
                    text,
                }
            } else {
                menuSelected = cafe.toLowerCase() === 'bobs' ? menu.bobsMenu : menu.marionsMenu; // get specific menu
                response = {
                    text: `${cafe} menu.`,
                    mrkdwn: true,
                    mrkdwn_in: ['text'],
                }
            }
        }
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

function makeOrder (options) {

}

module.exports = { showMenu, startOrder, makeOrder };
