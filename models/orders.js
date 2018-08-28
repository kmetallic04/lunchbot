const mongoose        = require('mongoose');
const dbSetup         = require('./db.setup');
const db = dbSetup('menu');

//Orders Schema
const orderSchema = new mongoose.Schema({
    person: {
        type: String,
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
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = db.model('Order', orderSchema);