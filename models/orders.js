const mongoose        = require('mongoose');
const { selectDb } = require('../src/utils');

const db = selectDb();

//Orders Schema
const orderSchema = new mongoose.Schema({
    person: {
        type: Object,
        required: [
            true,
            'Person is required'
        ]
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [
            true,
            'Item is required'
        ]
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [
            true,
            'Vendor is required'
        ]
    },
    amount: {
        type: Number,
        min: 0,
        required: [
            true,
            'Amount is required'
        ]
    },
    paid: {
        type: Boolean,
        default: false
    }
});

module.exports = db.model('Order', orderSchema);