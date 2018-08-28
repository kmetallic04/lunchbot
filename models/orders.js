const mongoose        = require('mongoose');
const dbSetup         = require('./db.setup');
const db = dbSetup('menu');

//Orders Schema
const orderSchema = new mongoose.Schema({
    person: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /\+\d{13}/.test(value);
            },
            message: 'Invalid phone number'
        }
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true, 
    },
    paid: {
        type: Boolean,
        default: false
    }
});

module.exports = db.model('Order', orderSchema);