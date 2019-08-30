const mongoose = require('mongoose');
const { selectedDb } = require('../utils');

const db = selectedDb;

//Menu items Schema

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Name is required'
        ]
    },
    price: {
        type: Number,
        min: 1.000,
        required: [
            true,
            'Price is required'
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
    active: {
        type: Boolean,
    }
});

module.exports = db.model('Item', itemSchema);
