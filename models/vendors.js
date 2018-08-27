const mongoose        = require('mongoose');
const dbSetup         = require('./db.setup');
const db = dbSetup('menu');

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
                return /\+\d{13}/.test(value);
            },
            message: 'Invalid phone number'
        }
    }
});

module.exports = db.model('Vendor', vendorSchema);
