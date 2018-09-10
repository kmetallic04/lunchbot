const mongoose      = require('mongoose');
const { selectDb }  = require('../utils');
const db            = selectDb();

//Orders Schema
const orderSchema   = new mongoose.Schema({
    person: {
        type    : Object,
        required: [
            true,
            'Person is required'
        ]
    },
    item: {
        type    : String,
        required: [
            true,
            'Item is required'
        ]
    },
    vendor: {
        type    : String,
        required: [
            true,
            'Vendor is required'
        ]
    },
    amount: {
        type    : Number,
        min     : 0,
        required: [
            true,
            'Amount is required'
        ]
    },
    time: {
        type    : Date,
        default : Date.now
    },
    paid: {
        type    : Boolean,
        default : false
    }
});

module.exports = db.model('Order', orderSchema);