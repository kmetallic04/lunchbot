const mongoose = require('mongoose');
const db       = require('./db.setup')('menu');

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
        ],
        validate: {
            validator: function (value) {
                return /\+\d{12}/.test(value);
            },
            message: 'Invalid phone number'
        }
    },
    checkout: {
        type: Map,
        of: String
    }
});

module.exports = db.model('Vendor', vendorSchema);
