const { log } = require('./utils');
const https = require('https');

const Vendor = require('./models/vendors');
const Item   = require('./models/items');
const Order  = require('./models/orders');

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

async function getVendors() {
    const vendors = await Vendor.find({});

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

async function showMenu(cafe) {
    const query = (cafe === 'All Cafes'? {}: {'vendor.name': cafe});
    const menu = await Item.aggregate([{$lookup:
        {
          from: Vendor.collection.name,
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendor'
        }},{$match: query}]);
    
    function markDownMenu(menu) {
        let blocks = [
            {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `\nOffers from ${cafe}`,
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Go Back",
                        emoji: true,
                    },
                    value: 'click_me_123',
                    action_id: 'start_order',
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
                        text: `*${item.name}*\n_Price_: *${item.price}*`,
                    },
                    accessory: {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Place Order",
                            emoji: true,
                        },
                        value: `{"dish":"${item.name}", "price":${item.price}, "cafe":"${item.vendor[0].name}", "item_id":"${item._id}", "vendor_id":"${item.vendor[0]._id}"}`,
                        action_id: 'make_order',
                    }
                },       
                {
                    type: 'context',
                    elements: [
                    {
                        type: 'plain_text',
                        text: `${item.vendor[0].name}`,
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
    return markDownMenu(menu);
}

function startOrder() {
    try {
        let blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Hi I'm lunch bot. You must be hungry. I'm here to help! Pick your favourite cafe from the dropdown list. I'll then give you the relevant menu."
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
                    text: `Here's your order. Are you cool with it? Click Confirm. Already changed your mind? Feel free to go back and choose another meal!\n
Username: *${options.username}*
Dish: *${options.dish}*
Price: *${options.price}*`
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Order to be delivered by ${options.cafe}`
                    }
                ]
            },
            {
                type: "divider"
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Confirm Order",
                            emoji: true
                        },
                        value: "click_me_123",
                        action_id: "confirm_order"
                    },
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Go Back",
                            emoji: true
                        },
                        value: "click_me_123",
                        action_id: "not_confirm_order"
                    }
                ]
            }           
        ];
        return {blocks: blocks};
    } catch (err) {
        throw err;
    }
}

async function showOrder(options){
    try {
        result = await Order.create({
            person: options.username,
            item: options.item_id,
            vendor: options.vendor_id,
            amount: options.price,
        });
        let blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${options.dish} coming up! :smile:\nThanks for using AT Lunch App! I'll leave your order details here, just for reference.`
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
                    {
                        type: 'context',
                        elements: [
                        {
                            type: 'plain_text',
                            text: `To be drop-shipped by ${options.cafe}`,
                            emoji: true,
                        }
                        ]
                    }
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
