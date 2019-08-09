const mongoose = require('mongoose');
const { selectDb } = require('../utils');

const db = selectDb();

const vendorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [
            true,
            'Email is required for login'
        ],
        unique: [
            true,
            'Email is already in use'
        ],
        trim: true,
        lowercase: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/],
    },
    password: {
        type: mongoose.Schema.Types.Mixed, 
        required: [
            true,
            'Password is required'
        ],
    },
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
        unique: [
            true,
            'This phone number has already been registered'
        ],
    },
});

module.exports = db.model('Vendor', vendorSchema);
