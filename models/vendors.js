const mongoose = require('mongoose');
const { selectDb } = require('../src/utils');

const db = selectDb();

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Vendor name is required'
        ],
        unique: [
            true,
            'Vendor already exists'
        ]
    },
    phone: {
        type: String,
        required: [
            true,
            'Phone number is required'
        ]
    },
    checkout: {
        type: Map,
        of: String
    }
});

module.exports = db.model('Vendor', vendorSchema);
