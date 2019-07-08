const { log } = require('./utils');
const https = require('https');

// TODO: set up db
function postResponse(url, postData) {
    try {
        baseUrl = 'hooks.slack.com';
        postOptions = {
            host: baseUrl,
            path: url.replace('https://' + baseUrl, ''),
            port: 443,
            method: 'POST',
        };
        const postReq = https.request(postOptions, function(res) {
            res.on('data', () => {
                console.log(`Response received from slack webhook ${url}`);
                console.log(`Status Code: ${res.statusCode}`);
            });
            res.on('error',(err) => {
                log.error(err);
            });
        });
        postReq.write(JSON.stringify(postData));
        postReq.end();
    } catch (err) {
        log.error(err);
    }
}

function getMenu(options) {
    // TODO: return specific menu from db
}

function getVendors() {
    const vendors = [
        {
            name: "All Cafes",
            phone: '0123456789'
        },
        {
            name: "Cafe Calana",
            phone: '0705983479',
        },
        {
            name: "Fogo Gaucho Restaurant",
            phone: '0705986779',
        },
        {
            name: "B-Club Restaurant",
            phone: '0707983189',
        },
        {
            name: "Mama Safi Dishes",
            phone: '0725363276',
        },
    ];

    function formatVendors(vendors) {
        let options = new Array();

        vendors.forEach((vendor) => {
            item = {
                text: {
                  type: "plain_text",
                  text: vendor.name,
                },
                value: vendor.name,
              }    
            options = [...options, item];
        });
        return {options: options};
    }
    return formatVendors(vendors);
}

function showMenu({options}) {

    // placeholder
    const menu = [
        {
            name: "Rice Beef",
            vendor: "Cafe Calana",
            price: 200,
        },
        {
            name: "Ugali Liver",
            vendor: "Mama Safi Dishes",
            price: 250,
        },
        {
            name: "Chapati Beef",
            vendor: "Mama Safi Dishes",
            price: 200,
        },
        {
            name: "Chips",
            vendor: "Cafe Calana",
            price: 150,
        },
        {
            name: "Rice Chicken",
            vendor: "Fogo Gaucho",
            price: 300,
        },
        {
            name: "Pilau Beef",
            vendor: "Cafe Calana",
            price: 250,
        },
        {
            name: "Chips Masala",
            vendor: "B-Club Restaurant",
            price: 250,
        }
    ];

    cafe = 'all';
    
    function markDownMenu(menu) {
        let blocks = [
            {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `\n*OFFERS FROM ${cafe === 'all'? 'ALL CAFES': toUpperCase(cafe)}*`,
                }
            },       
            {
                type: 'divider',
            }
        ];

        menu.forEach((item, index) => {
            block = [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Dish: *${item.name}*     _Price_: *${item.price}*`,
                    },
                    accessory: {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Order",
                            emoji: true,
                        },
                        value: `{"dish":"${item.name}", "price":${item.price}, "cafe":"${item.vendor}"}`,
                        action_id: 'make_order',
                    }
                },       
                {
                    type: 'context',
                    elements: [
                    {
                        type: 'plain_text',
                        text: `From ${item.vendor}`,
                        emoji: true,
                    }
                    ]
                },
                {
                    type: 'divider',
                }
            ];

            blocks = [...blocks, ...block];

        });

        let formattedMenu = {
            response_type: 'in_channel',
            blocks: blocks,
        }
        return formattedMenu;
    };
        

    try {
        let response, menuSelected;
        if (cafe === 'all') {
            menuSelected = menu;
            response = markDownMenu(menuSelected);
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

function startOrder() {
    try {
        let blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Hi I'm lunch bot. You must be hungry. I'm here to help! :smile: Please pick your fav cafe from the dropdown list. I'll then magically give you the menu."
                },
                accessory: {
                    action_id: "pick_cafe",
                    type: "external_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select an item"
                    },
                    min_query_length: 0,
                }
            }
        ];
        return {blocks: blocks};
    } catch (err) {
        throw err;
    }
}

function makeOrder (options) {
    try {
        let blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Here's your order. Are you cool with it? Click Confirm. Already changed your mind? Feel free to run */lunch* again!\n
Username: *${options.username}*
Dish: *${options.dish}*
Price: *${options.price}*`
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Confirm Order",
                        emoji: true
                    },
                    value: "click_me_123",
                    action_id: "confirm_order",
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Order to be delivered by ${options.cafe}`
                    }
                ]
            }
        ];
        return {blocks: blocks};
    } catch (err) {
        throw err;
    }
}

function showOrder(options){
    try {
        let blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${options.dish} coming up! :smile:\nThanks for using lunchbot! I'll leave your order details here, just for reference.`
                },
            },
        ];

        let attachments = [
            {
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `Username: *${options.username}*\nDish: *${options.dish}*\nPrice: *${options.price}*`
                        }
                    },
                ]
            }
        ];
        return {blocks: blocks, attachments: attachments};
    } catch (err) {
        throw err;
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

module.exports = { postResponse, getVendors, showMenu, startOrder, makeOrder, showOrder, toTitleCase };
