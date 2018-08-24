const { log } = require('./utils');

// TODO: set up db

function getMenu (options) {

    // placeholder
    const menu = {
        bobsMenu: [
            {
                text: 'Rice Nyama: 300',
                value: 1,
            },
            {
                text: 'Ugali managu: 180',
                value: 2,
            },
        ],
        marionsMenu: [
            {
                text: 'Rice Nyama: 300',
                value: 1,
            },
            {
                text: 'Ugali managu: 180',
                value: 2,
            },
        ]
    }

    try {
        let response, menuSelected;
        const { cafe, slackReqObj } = options;

        if (cafe === 'all') {
            menuSelected = menu;
            // create a response with all the menus
            response = {
                text: 'All menus',
                mrkdwn: true,
                mrkdwn_in: ['text, attachments'],
                attachments: [{
                    text: 'What would you like to order?',
                    fallback: 'What would you like to order?',
                    color: '#2c963f',
                    attachment_type: 'default',
                    callback_id: 'order_selected',
                    // actions: [{
                    //     name: 'show_menu_menu',
                    //     text: 'Choose a report...',
                    //     type: 'select', // render menu
                    //     options: menu,
                    // }],
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
                };
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

function orderSelectedFood(options) {
    // start an order
}

module.exports = { getMenu, orderSelectedFood };
